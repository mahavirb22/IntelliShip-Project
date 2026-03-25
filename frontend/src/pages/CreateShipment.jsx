import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Send,
  CheckCircle,
  Copy,
  Mail,
  Share2,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { createShipment } from "../services/api";
import QRCode from "react-qr-code";

const CreateShipment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdShipmentId, setCreatedShipmentId] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    fragility_level: "Medium",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shipmentData = {
      ...formData,
    };

    try {
      const response = await createShipment(shipmentData);
      const createdShipment = response.data?.shipment || response.data;

      setCreatedShipmentId(createdShipment.shipment_id);
      setTrackingLink(
        createdShipment.tracking_link ||
          `${window.location.origin}/track/${createdShipment.shipment_id}`,
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Failed to create shipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendTrackingEmail = () => {
    const subject = `Track Your Shipment - ${createdShipmentId}`;
    const body = `Hello ${formData.customer_name},

Your shipment has been created and is ready for tracking!

📦 Shipment ID: ${createdShipmentId}
📦 Product: ${formData.product_name}

🔗 Track your shipment: ${trackingLink}

You can track your shipment in real-time using the link above or by entering your shipment ID on our website.

Thank you for choosing IntelliShip!

Best regards,
IntelliShip Team`;

    window.open(
      `mailto:${formData.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const shareTracking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Track Your Shipment",
          text: `Track your shipment ${createdShipmentId} on IntelliShip`,
          url: trackingLink,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface">
      <Sidebar />

      <main className="flex-1 w-full min-w-0 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto mt-12 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 font-display gradient-text">
            Create New Shipment
          </h1>
          <p className="text-on-surface-variant">Fill in the details to start tracking</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-primary/15 to-secondary/15 p-3 rounded-lg border border-primary/20">
                  <Package size={28} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-display">Shipment Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-on-surface-variant">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="e.g., Electronics, Glassware, Furniture"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-on-surface-variant">
                    Fragility Level *
                  </label>
                  <select
                    name="fragility_level"
                    value={formData.fragility_level}
                    onChange={handleChange}
                    className="input-field appearance-none"
                    required
                  >
                    <option value="Low" className="bg-white text-gray-900">Low - Durable items</option>
                    <option value="Medium" className="bg-white text-gray-900">Medium - Standard care</option>
                    <option value="High" className="bg-white text-gray-900">High - Fragile items</option>
                    <option value="Very High" className="bg-white text-gray-900">
                      Very High - Extremely delicate
                    </option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-on-surface-variant">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-on-surface-variant">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="customer@email.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-on-surface-variant">
                    Customer Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="input-field"
                  />
                  <p className="mt-1 text-xs text-on-surface-variant/60">
                    Phone number can be used to send tracking info via SMS
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Create Shipment
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="btn-secondary px-8 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card max-w-3xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="inline-block bg-gradient-to-br from-safe/30 to-primary/30 p-6 rounded-full mb-6"
                >
                  <CheckCircle size={64} className="text-safe" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 font-display gradient-text">
                  Shipment Created Successfully!
                </h2>
                <p className="text-on-surface-variant mb-2">
                  Share this tracking information with your customer
                </p>
              </div>

              {/* Shipment ID */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <p className="text-on-surface-variant text-sm mb-2">Shipment ID:</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-2xl font-mono text-primary font-bold">
                    {createdShipmentId}
                  </p>
                  <button
                    onClick={() => copyToClipboard(createdShipmentId)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Tracking Link */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <p className="text-on-surface-variant text-sm mb-2">Tracking Link:</p>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={trackingLink}
                    readOnly
                    className="input-field flex-1 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(trackingLink)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={sendTrackingEmail}
                    className="btn-secondary flex items-center justify-center gap-2 text-sm"
                  >
                    <Mail size={16} />
                    Email Customer
                  </button>
                  {navigator.share && (
                    <button
                      onClick={shareTracking}
                      className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  )}
                  <button
                    onClick={() => window.open(trackingLink, "_blank")}
                    className="btn-secondary flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink size={16} />
                    Open
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100 text-center">
                <p className="text-on-surface-variant text-sm mb-4">
                  QR Code for Easy Tracking (Print on shipping label)
                </p>
                <div className="bg-white p-6 rounded-xl inline-block">
                  <QRCode value={trackingLink} size={200} />
                </div>
                <p className="text-xs text-on-surface-variant/60 mt-4">
                  Customers can scan this QR code to instantly track their
                  shipment
                </p>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6 border border-primary/20">
                <h3 className="font-semibold mb-3 text-primary">
                  How customers can track:
                </h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    <span>Click the tracking link you shared with them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    <span>Scan the QR code on the package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    <span>Enter the Shipment ID on intelliship.com</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/dashboard/shipments")}
                  className="btn-primary flex-1"
                >
                  View All Shipments
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setCreatedShipmentId("");
                    setTrackingLink("");
                    setFormData({
                      product_name: "",
                      fragility_level: "Medium",
                      customer_name: "",
                      customer_email: "",
                      customer_phone: "",
                    });
                  }}
                  className="btn-secondary px-8 w-full sm:w-auto"
                >
                  Create Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CreateShipment;
