const mongoose = require("mongoose");
const { EVENT_SEVERITY } = require("../utils/statusEnums");

const eventSchema = new mongoose.Schema({
  shipment_id: {
    type: String,
    required: [true, "Shipment ID is required"],
    trim: true,
  },
  event_type: {
    type: String,
    trim: true,
    default: "VIBRATION",
  },
  severity: {
    type: String,
    required: [true, "Severity is required"],
    enum: {
      values: EVENT_SEVERITY,
      message: "Severity must be LOW, MEDIUM, or HIGH",
    },
  },
  intensity: {
    type: Number,
    required: [true, "Intensity is required"],
    min: [0, "Intensity cannot be negative"],
  },
  risingEdges: {
    type: Number,
    default: 0,
    min: [0, "Rising edges cannot be negative"],
  },
  avgHigh: {
    type: Number,
    default: 0,
    min: [0, "Average high cannot be negative"],
  },
  pulseCount: {
    type: Number,
    default: 0,
    min: [0, "Pulse count cannot be negative"],
  },
  maxHigh: {
    type: Number,
    default: 0,
    min: [0, "Max high cannot be negative"],
  },
  totalHigh: {
    type: Number,
    default: 0,
    min: [0, "Total high cannot be negative"],
  },
  riskScore: {
    type: Number,
    default: 0,
    min: [0, "Risk score cannot be negative"],
    max: [1, "Risk score cannot exceed 1"],
  },
  timestamp: { type: Date, default: Date.now },
});

// Index for efficient queries by shipment_id and timestamp
eventSchema.index({ shipment_id: 1, timestamp: -1 });

module.exports = mongoose.model("Event", eventSchema);
