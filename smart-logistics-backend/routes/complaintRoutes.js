const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const Shipment = require("../models/Shipment");

router.post("/", async (req, res) => {
  try {
    const { shipment_id, complaint_text } = req.body;

    if (!shipment_id || !complaint_text) {
      return res.status(400).json({
        success: false,
        error: "shipment_id and complaint_text are required",
      });
    }

    const shipment = await Shipment.findOne({ shipment_id });
    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: "Shipment not found",
      });
    }

    const complaint = await Complaint.create({
      shipment_id,
      complaint_text: complaint_text.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
