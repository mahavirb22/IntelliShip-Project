const mongoose = require("mongoose");
const {
  SHIPMENT_LIFECYCLE,
  SHIPMENT_CONDITION,
} = require("../utils/statusEnums");

const VERIFICATION_STATUS = ["PENDING", "SAFE", "DAMAGED"];

const shipmentLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["SYSTEM", "EVENT", "MANUAL"],
      default: "SYSTEM",
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const shipmentSchema = new mongoose.Schema({
  shipment_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  device_id: {
    type: String,
    trim: true,
    default: null,
    required() {
      return this.active;
    },
  },
  product_name: { type: String, required: true, trim: true },
  fragility_level: {
    type: String,
    default: "Medium",
    enum: ["Low", "Medium", "High", "Very High"],
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller_name: { type: String, required: true, trim: true },
  seller_email: { type: String, required: true, trim: true, lowercase: true },
  customer_name: { type: String, required: true, trim: true },
  customer_email: { type: String, required: true, trim: true, lowercase: true },
  customer_phone: { type: String, trim: true },
  status: {
    type: String,
    default: "CREATED",
    enum: SHIPMENT_LIFECYCLE,
  },
  condition: {
    type: String,
    default: "SAFE",
    enum: SHIPMENT_CONDITION,
  },
  verificationStatus: {
    type: String,
    enum: VERIFICATION_STATUS,
    default: "PENDING",
  },
  deliveredAt: { type: Date, default: null },
  statusHistory: {
    type: [
      {
        status: {
          type: String,
          enum: SHIPMENT_LIFECYCLE,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
          required: true,
        },
        location: {
          type: String,
          trim: true,
        },
      },
    ],
    default: [],
  },
  monitoring_started: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  highEventCount: { type: Number, default: 0, min: 0 },
  latestRiskScore: { type: Number, default: 0, min: 0, max: 1 },
  logs: { type: [shipmentLogSchema], default: [] },
  tracking_link: { type: String, trim: true },
  created_at: { type: Date, default: Date.now },
});

// Index for seller queries
shipmentSchema.index({ seller_id: 1, created_at: -1 });
// Ensure one device can only be mapped to one active shipment at a time.
shipmentSchema.index(
  { device_id: 1 },
  { unique: true, partialFilterExpression: { active: true } },
);

module.exports = mongoose.model("Shipment", shipmentSchema);
