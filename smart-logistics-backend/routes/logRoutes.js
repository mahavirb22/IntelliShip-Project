const express = require("express");
const router = express.Router();
const Shipment = require("../models/Shipment");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.post("/manual", auth, authorize("seller", "admin"), async (req, res) => {
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

    if (
      req.user.role !== "admin" &&
      String(shipment.seller_id) !== String(req.user._id)
    ) {
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
});

module.exports = router;
