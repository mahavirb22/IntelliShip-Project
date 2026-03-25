const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Shipment = require("../models/Shipment");
const { getRiskPrediction } = require("../utils/mlClient");
const { EVENT_SEVERITY } = require("../utils/statusEnums");

const HIGH_EVENT_DAMAGE_THRESHOLD = Number(
  process.env.HIGH_EVENT_DAMAGE_THRESHOLD || 3,
);
const LOW_REPEAT_WINDOW_SECONDS = Number(
  process.env.LOW_REPEAT_WINDOW_SECONDS || 20,
);
const LOW_MIN_MEANINGFUL_INTENSITY = Number(
  process.env.LOW_MIN_MEANINGFUL_INTENSITY || 15,
);
const MEDIUM_MIN_INTENSITY = Number(process.env.MEDIUM_MIN_INTENSITY || 45);
const MEDIUM_MIN_PULSE_COUNT = Number(process.env.MEDIUM_MIN_PULSE_COUNT || 3);
const EVENT_DEDUP_WINDOW_SECONDS = Number(
  process.env.NODE_ENV === "test"
    ? process.env.EVENT_DEDUP_WINDOW_SECONDS || 0
    : process.env.EVENT_DEDUP_WINDOW_SECONDS || 15,
);

const toSeverityFromLegacyType = (eventType = "") => {
  const normalized = String(eventType).toUpperCase();

  if (["SEVERE", "HIGH"].includes(normalized)) return "HIGH";
  if (["MODERATE", "MINOR", "MEDIUM"].includes(normalized)) return "MEDIUM";
  return "LOW";
};

const getSeverityByIntensity = (intensity) => {
  if (intensity >= 80) return "HIGH";
  if (intensity >= 40) return "MEDIUM";
  return "LOW";
};

const getPriority = (severity) => {
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  return 1;
};

const getHigherSeverity = (a, b) => {
  const first = EVENT_SEVERITY.includes(String(a || "").toUpperCase())
    ? String(a).toUpperCase()
    : "LOW";
  const second = EVENT_SEVERITY.includes(String(b || "").toUpperCase())
    ? String(b).toUpperCase()
    : "LOW";

  return getPriority(first) >= getPriority(second) ? first : second;
};

const isWithinWindow = (timestamp, windowSeconds) => {
  if (!timestamp || !Number.isFinite(windowSeconds) || windowSeconds <= 0) {
    return false;
  }

  const previousAt = new Date(timestamp).getTime();
  if (Number.isNaN(previousAt)) {
    return false;
  }

  return Date.now() - previousAt <= windowSeconds * 1000;
};

const shouldFilterByNoise = ({
  severity,
  intensity,
  avgIntensity,
  eventCount,
  lastEvent,
}) => {
  // Always keep high-severity batches to avoid missing critical incidents.
  if (severity === "HIGH") {
    return false;
  }

  if (
    severity === "LOW" &&
    intensity < LOW_MIN_MEANINGFUL_INTENSITY &&
    avgIntensity < LOW_MIN_MEANINGFUL_INTENSITY
  ) {
    return true;
  }

  if (
    severity === "LOW" &&
    lastEvent?.severity === "LOW" &&
    isWithinWindow(lastEvent.timestamp, LOW_REPEAT_WINDOW_SECONDS)
  ) {
    return true;
  }

  // Keep medium only when batch signal is strong enough.
  if (severity === "MEDIUM") {
    const meaningfulMedium =
      intensity >= MEDIUM_MIN_INTENSITY ||
      avgIntensity >= LOW_MIN_MEANINGFUL_INTENSITY ||
      eventCount >= MEDIUM_MIN_PULSE_COUNT;

    return !meaningfulMedium;
  }

  return false;
};

const isDuplicateEvent = ({ severity, lastEvent }) => {
  if (!lastEvent) {
    return false;
  }

  return (
    lastEvent.severity === severity &&
    isWithinWindow(lastEvent.timestamp, EVENT_DEDUP_WINDOW_SECONDS)
  );
};

const eventMessageMap = {
  LOW: "Low vibration detected",
  MEDIUM: "Medium vibration detected",
  HIGH: "High vibration detected",
};

const toCondition = (severity, riskScore) => {
  if (severity === "HIGH" || riskScore >= 0.8) {
    return "DAMAGED";
  }

  if (severity === "MEDIUM" || riskScore >= 0.45) {
    return "AT_RISK";
  }

  return "SAFE";
};

// ESP32 sends event here
router.post("/", async (req, res) => {
  try {
    const {
      shipment_id,
      event_type,
      severity,
      intensity,
      risingEdges,
      avgHigh,
      pulseCount,
      maxHigh,
      totalHigh,
    } = req.body;

    if (!shipment_id) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: shipment_id",
      });
    }

    const shipment = await Shipment.findOne({ shipment_id });
    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: "Shipment not found",
      });
    }

    const numericIntensity = Number(
      intensity ?? Math.max(Number(avgHigh || 0), Number(risingEdges || 0) * 4),
    );
    const numericAvgIntensity = Number(avgHigh || 0);
    const numericPulseCount = Number(pulseCount || 0);

    if (!Number.isFinite(numericIntensity) || numericIntensity < 0) {
      return res.status(400).json({
        success: false,
        error: "intensity must be a non-negative number",
      });
    }

    if (!Number.isFinite(numericAvgIntensity) || numericAvgIntensity < 0) {
      return res.status(400).json({
        success: false,
        error: "avgHigh must be a non-negative number",
      });
    }

    if (!Number.isFinite(numericPulseCount) || numericPulseCount < 0) {
      return res.status(400).json({
        success: false,
        error: "pulseCount must be a non-negative number",
      });
    }

    const inferredSeverity = getSeverityByIntensity(numericIntensity);
    const explicitSeverity = EVENT_SEVERITY.includes(
      String(severity || "").toUpperCase(),
    )
      ? String(severity).toUpperCase()
      : event_type
        ? toSeverityFromLegacyType(event_type)
        : "LOW";

    // Final severity is resolved by strict priority: HIGH > MEDIUM > LOW.
    const finalSeverity = getHigherSeverity(explicitSeverity, inferredSeverity);

    const lastEvent = await Event.findOne({ shipment_id })
      .sort({ timestamp: -1 })
      .lean();

    if (
      shouldFilterByNoise({
        severity: finalSeverity,
        intensity: numericIntensity,
        avgIntensity: numericAvgIntensity,
        eventCount: numericPulseCount,
        lastEvent,
      })
    ) {
      return res.status(200).json({
        success: true,
        stored: false,
        reason: "filtered",
      });
    }

    if (isDuplicateEvent({ severity: finalSeverity, lastEvent })) {
      return res.status(200).json({
        success: true,
        stored: false,
        reason: "duplicate",
      });
    }

    const mlPrediction = await getRiskPrediction({
      intensity: numericIntensity,
      pulseCount: numericPulseCount,
      maxHigh: Number(maxHigh || 0),
      totalHigh: Number(totalHigh || 0),
      risingEdges: Number(risingEdges || 0),
      avgHigh: numericAvgIntensity,
      severity: finalSeverity,
    });

    const riskScore = Number(mlPrediction?.risk_score);
    const normalizedRiskScore =
      Number.isFinite(riskScore) && riskScore >= 0 && riskScore <= 1
        ? riskScore
        : Math.min(1, numericIntensity / 100);

    const event = new Event({
      shipment_id,
      event_type: event_type || "VIBRATION",
      severity: finalSeverity,
      intensity: numericIntensity,
      risingEdges: Number(risingEdges || 0),
      avgHigh: numericAvgIntensity,
      pulseCount: numericPulseCount,
      avgIntensity: numericAvgIntensity,
      eventCount: numericPulseCount,
      maxHigh: Number(maxHigh || 0),
      totalHigh: Number(totalHigh || 0),
      riskScore: normalizedRiskScore,
    });

    await event.save();

    if (finalSeverity === "HIGH") {
      shipment.highEventCount = Number(shipment.highEventCount || 0) + 1;
    }

    shipment.latestRiskScore = normalizedRiskScore;
    shipment.condition = toCondition(finalSeverity, normalizedRiskScore);

    const currentStatus = shipment.status;
    const canBeDamaged = ["PACKED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(
      currentStatus,
    );

    if (
      canBeDamaged &&
      Number(shipment.highEventCount || 0) >= HIGH_EVENT_DAMAGE_THRESHOLD
    ) {
      shipment.status = "DAMAGED";
      shipment.condition = "DAMAGED";
      shipment.statusHistory.push({
        status: "DAMAGED",
        timestamp: new Date(),
        location: req.body.location,
      });
    }

    shipment.logs.push({
      message: `${eventMessageMap[finalSeverity]} (Batch of ${numericPulseCount} readings)`,
      type: "EVENT",
      timestamp: new Date(),
    });

    await shipment.save();

    res.status(201).json({
      success: true,
      stored: true,
      reason: "stored",
      message: "Event stored successfully",
      event_id: event._id,
      shipment_status: shipment.status,
      shipment_condition: shipment.condition,
      risk_score: normalizedRiskScore,
      high_event_count: shipment.highEventCount,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get all events of shipment with pagination
router.get("/:shipment_id", async (req, res) => {
  try {
    const { shipment_id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: "Invalid pagination parameters",
      });
    }

    const events = await Event.find({ shipment_id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalEvents = await Event.countDocuments({ shipment_id });
    const totalPages = Math.ceil(totalEvents / limit);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        eventsPerPage: limit,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
