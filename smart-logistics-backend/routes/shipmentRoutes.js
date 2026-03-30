const express = require("express");
const router = express.Router();
const Shipment = require("../models/Shipment");
const Event = require("../models/Event");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  SHIPMENT_LIFECYCLE,
  isValidTransition,
} = require("../utils/statusEnums");
const {
  buildShipmentCacheKey,
  getShipmentCache,
  setShipmentCache,
  invalidateShipmentCache,
} = require("../utils/shipmentCache");
const { sendShipmentCreatedEmail } = require("../utils/emailService");

const generateShipmentId = () => {
  const timestamp = Date.now().toString().slice(-8);
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SHIP${timestamp}${randomPart}`;
};

const toTrackingPath = (baseUrl, shipmentId) =>
  `${baseUrl.replace(/\/$/, "")}/track/${shipmentId}`;

const appendStatusHistory = (shipment, status, location) => {
  const currentStatus = shipment.status;
  if (currentStatus === status) {
    return;
  }

  shipment.status = status;
  shipment.statusHistory.push({
    status,
    timestamp: new Date(),
    ...(location ? { location } : {}),
  });
};

const canAccessShipment = (shipment, user) => {
  if (!shipment || !user) return false;
  return (
    user.role === "admin" || String(shipment.seller_id) === String(user._id)
  );
};

const buildTrackingResponse = (shipment, events) => ({
  success: true,
  data: shipment,
  events,
});

// Create Shipment (Protected - Seller/Admin)
router.post("/", auth, authorize("seller", "admin"), async (req, res) => {
  try {
    const shipment_id = req.body.shipment_id || generateShipmentId();
    const device_id = String(req.body.device_id || "").trim();

    if (!device_id) {
      return res.status(400).json({
        success: false,
        error: "device_id is required",
      });
    }

    const existingActiveShipment = await Shipment.findOne({
      device_id,
      active: true,
    }).lean();

    if (existingActiveShipment) {
      return res.status(409).json({
        success: false,
        error: "This device is already assigned to an active shipment",
      });
    }

    const baseUrl =
      process.env.FRONTEND_BASE_URL ||
      "https://intelli-ship-project-frontend.vercel.app";

    const shipment = new Shipment({
      ...req.body,
      shipment_id,
      device_id,
      status: "CREATED",
      condition: "SAFE",
      monitoring_started: false,
      active: true,
      tracking_link: toTrackingPath(baseUrl, shipment_id),
      statusHistory: [
        {
          status: "CREATED",
          timestamp: new Date(),
          location: req.body.origin_location,
        },
      ],
      logs: [
        {
          message: "Shipment Created",
          type: "SYSTEM",
          timestamp: new Date(),
        },
      ],
      seller_id: req.user._id,
      seller_name: req.user.name,
      seller_email: req.user.email,
    });

    await shipment.save();
    invalidateShipmentCache(shipment.shipment_id);

    try {
      const trackingUrl = `${process.env.FRONTEND_BASE_URL}/track/${shipment.shipment_id}`;

      await sendShipmentCreatedEmail({
        email: shipment.customer_email,
        name: shipment.customer_name,
        shipmentId: shipment.shipment_id,
        trackingUrl,
      });
    } catch (err) {
      console.error("Email trigger failed:", err.message);
    }

    res.status(201).json({
      success: true,
      shipment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// Update shipment lifecycle status (Protected - Seller/Admin)
router.patch(
  "/:id/status",
  auth,
  authorize("seller", "admin"),
  async (req, res) => {
    try {
      const { status, location } = req.body;

      if (!status || !SHIPMENT_LIFECYCLE.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Valid status is required",
        });
      }

      if (["DELIVERED", "VERIFIED", "COMPLETED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Use delivered/verification endpoints for post-delivery lifecycle updates",
        });
      }

      const shipment = await Shipment.findOne({ shipment_id: req.params.id });
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: "Shipment not found",
        });
      }

      if (!canAccessShipment(shipment, req.user)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (!isValidTransition(shipment.status, status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${shipment.status} to ${status}`,
        });
      }

      appendStatusHistory(shipment, status, location);

      shipment.logs.push({
        message: `Lifecycle updated to ${status}`,
        type: "MANUAL",
        timestamp: new Date(),
      });

      await shipment.save();
      invalidateShipmentCache(shipment.shipment_id);

      res.json({
        success: true,
        data: shipment,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// Mark shipment delivered (Protected - Seller/Admin)
router.patch(
  "/:id/delivered",
  auth,
  authorize("seller", "admin"),
  async (req, res) => {
    try {
      const shipment = await Shipment.findOne({ shipment_id: req.params.id });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: "Shipment not found",
        });
      }

      if (!canAccessShipment(shipment, req.user)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (!isValidTransition(shipment.status, "DELIVERED")) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${shipment.status} to DELIVERED`,
        });
      }

      appendStatusHistory(shipment, "DELIVERED", req.body?.location);
      shipment.deliveredAt = new Date();
      shipment.verificationStatus = "PENDING";
      shipment.logs.push({
        message: "Shipment marked as DELIVERED. Awaiting customer verification",
        type: "MANUAL",
        timestamp: new Date(),
      });

      await shipment.save();
      invalidateShipmentCache(shipment.shipment_id);

      return res.json({
        success: true,
        data: shipment,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

const canVerifyShipment = (shipment) => {
  if (!shipment.deliveredAt || shipment.status !== "DELIVERED") {
    return "Shipment can be verified only after delivery";
  }

  if (shipment.verificationStatus !== "PENDING") {
    return `Shipment already verified as ${shipment.verificationStatus}`;
  }

  return null;
};

const releaseDeviceAndComplete = (shipment, verificationStatus) => {
  if (shipment.status !== "DELIVERED") {
    return "Shipment can be verified only after delivery";
  }

  if (!["SAFE", "DAMAGED"].includes(verificationStatus)) {
    return "Invalid verification status for completion";
  }

  shipment.verificationStatus = verificationStatus;
  shipment.condition = verificationStatus;

  appendStatusHistory(shipment, "VERIFIED");
  appendStatusHistory(shipment, "COMPLETED");

  shipment.active = false;
  shipment.device_id = null;
  shipment.monitoring_started = false;

  return null;
};

// Customer verifies product as safe
router.patch("/:id/verify-safe", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ shipment_id: req.params.id });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const verificationError = canVerifyShipment(shipment);
    if (verificationError) {
      return res.status(400).json({
        success: false,
        message: verificationError,
      });
    }

    const releaseError = releaseDeviceAndComplete(shipment, "SAFE");
    if (releaseError) {
      return res.status(400).json({
        success: false,
        message: releaseError,
      });
    }

    shipment.logs.push({
      message: "Customer verified shipment as SAFE. Shipment completed",
      type: "MANUAL",
      timestamp: new Date(),
    });

    await shipment.save();
    invalidateShipmentCache(shipment.shipment_id);

    return res.json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Customer verifies product as damaged after complaint submission
router.patch("/:id/verify-damaged", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ shipment_id: req.params.id });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const verificationError = canVerifyShipment(shipment);
    if (verificationError) {
      return res.status(400).json({
        success: false,
        message: verificationError,
      });
    }

    const complaint = await Complaint.findOne({
      shipment_id: shipment.shipment_id,
    }).lean();

    if (!complaint) {
      return res.status(400).json({
        success: false,
        message: "Complaint is required before marking shipment as damaged",
      });
    }

    const releaseError = releaseDeviceAndComplete(shipment, "DAMAGED");
    if (releaseError) {
      return res.status(400).json({
        success: false,
        message: releaseError,
      });
    }

    shipment.logs.push({
      message: "Customer verified shipment as DAMAGED. Shipment completed",
      type: "MANUAL",
      timestamp: new Date(),
    });

    await shipment.save();
    invalidateShipmentCache(shipment.shipment_id);

    return res.json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Start Monitoring (Protected - Seller/Admin)
router.post(
  "/:id/start-monitoring",
  auth,
  authorize("seller", "admin"),
  async (req, res) => {
    try {
      const shipment = await Shipment.findOne({ shipment_id: req.params.id });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: "Shipment not found",
        });
      }

      if (!canAccessShipment(shipment, req.user)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (!shipment.monitoring_started) {
        shipment.monitoring_started = true;
        shipment.logs.push({
          message: "Monitoring Started",
          type: "SYSTEM",
          timestamp: new Date(),
        });
      }

      if (shipment.status === "CREATED") {
        appendStatusHistory(shipment, "PACKED", req.body.location);
      }

      if (shipment.status === "PACKED") {
        appendStatusHistory(shipment, "IN_TRANSIT", req.body.location);
      }

      await shipment.save();
      invalidateShipmentCache(shipment.shipment_id);

      res.json({
        success: true,
        message: "Monitoring activated",
        data: shipment,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// Manual log updates by delivery partners/seller (Protected)
router.post(
  "/logs/manual",
  auth,
  authorize("seller", "admin"),
  async (req, res) => {
    try {
      const { shipment_id, message } = req.body;

      if (!shipment_id || !message) {
        return res.status(400).json({
          success: false,
          error: "shipment_id and message are required",
        });
      }

      const shipment = await Shipment.findOne({ shipment_id });
      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: "Shipment not found",
        });
      }

      if (!canAccessShipment(shipment, req.user)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      shipment.logs.push({
        message: message.trim(),
        type: "MANUAL",
        timestamp: new Date(),
      });

      await shipment.save();
      invalidateShipmentCache(shipment.shipment_id);

      res.status(201).json({
        success: true,
        message: "Manual log added",
        data: shipment,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// Get all shipments for logged-in seller/admin (Protected)
router.get("/", auth, authorize("seller", "admin"), async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { seller_id: req.user._id };

    const shipments = await Shipment.find(query)
      .sort({
        created_at: -1,
      })
      .lean();

    res.json({
      success: true,
      shipments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Public secure tracking with shipment id + mobile validation
router.post("/track", async (req, res) => {
  try {
    const { shipment_id, mobile } = req.body;

    if (!shipment_id || !mobile) {
      return res.status(400).json({
        success: false,
        message: "shipment_id and mobile are required",
      });
    }

    const cacheKey = buildShipmentCacheKey({
      shipmentId: shipment_id,
      mobile,
    });
    const cached = getShipmentCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const shipment = await Shipment.findOne({
      shipment_id: shipment_id.trim(),
    }).lean();

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const normalizedMobile = String(mobile).replace(/\D/g, "");
    const shipmentMobile = String(shipment.customer_phone || "").replace(
      /\D/g,
      "",
    );

    if (!shipmentMobile || normalizedMobile !== shipmentMobile) {
      return res.status(401).json({
        success: false,
        message: "Invalid shipment credentials",
      });
    }

    const events = await Event.find({ shipment_id: shipment.shipment_id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const payload = buildTrackingResponse(shipment, events);
    setShipmentCache(cacheKey, payload);

    res.json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Get Shipment by ID (Public fallback for QR links)
router.get("/:id", async (req, res) => {
  try {
    const cacheKey = buildShipmentCacheKey({ shipmentId: req.params.id });
    const cached = getShipmentCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const shipment = await Shipment.findOne({
      shipment_id: req.params.id,
    }).lean();

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const events = await Event.find({ shipment_id: shipment.shipment_id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const payload = buildTrackingResponse(shipment, events);
    setShipmentCache(cacheKey, payload);

    res.json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
