const express = require("express");
const router = express.Router();
const Shipment = require("../models/Shipment");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, authorize("seller", "admin"), async (req, res) => {
  try {
    const shipmentFilter =
      req.user.role === "admin" ? {} : { seller_id: req.user._id };

    const shipmentIds =
      await Shipment.find(shipmentFilter).distinct("shipment_id");

    const [
      totalShipments,
      activeShipments,
      deliveredShipments,
      damagedShipments,
      eventFrequency,
    ] = await Promise.all([
      Shipment.countDocuments(shipmentFilter),
      Shipment.countDocuments({
        ...shipmentFilter,
        status: {
          $in: ["CREATED", "PACKED", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
        },
      }),
      Shipment.countDocuments({ ...shipmentFilter, status: "DELIVERED" }),
      Shipment.countDocuments({ ...shipmentFilter, status: "DAMAGED" }),
      Event.aggregate([
        {
          $match: {
            shipment_id: { $in: shipmentIds },
            timestamp: {
              $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            },
          },
        },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$timestamp",
                },
              },
              severity: "$severity",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalShipments,
        activeShipments,
        deliveredShipments,
        damagedShipments,
        eventFrequency,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
