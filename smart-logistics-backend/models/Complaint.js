const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  shipment_id: {
    type: String,
    required: [true, "Shipment ID is required"],
    trim: true,
  },
  complaint_text: {
    type: String,
    required: [true, "Complaint text is required"],
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
});

complaintSchema.index({ shipment_id: 1, created_at: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
