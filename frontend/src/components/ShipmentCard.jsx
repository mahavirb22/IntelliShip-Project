import React from "react";
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ShipmentCard = ({ shipment, index = 0 }) => {
  const navigate = useNavigate();
  const eventLogs = Array.isArray(shipment.logs)
    ? shipment.logs.filter((log) => log.type === "EVENT")
    : [];
  const lastLog =
    Array.isArray(shipment.logs) && shipment.logs.length > 0
      ? [...shipment.logs].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        )[0]
      : null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card cursor-pointer"
      onClick={() => navigate(`/dashboard/shipments/${shipment.shipment_id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Package size={24} className="text-primary-dim" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{shipment.product_name}</h3>
            <p className="text-sm text-on-surface-variant">ID: {shipment.shipment_id}</p>
          </div>
        </div>
        <StatusBadge status={shipment.status} size="sm" />
      </div>

      <div className="space-y-2 mt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Fragility:</span>
          <span className="font-medium">
            {shipment.fragility_level || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Customer:</span>
          <span className="font-medium">{shipment.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Events:</span>
          <span className="font-medium">{eventLogs.length}</span>
        </div>
        {lastLog?.timestamp && (
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Last Update:</span>
            <span className="font-medium">{formatDate(lastLog.timestamp)}</span>
          </div>
        )}
      </div>

      <button className="mt-4 w-full btn-secondary py-2 text-sm">
        View Details →
      </button>
    </motion.div>
  );
};

export default ShipmentCard;
