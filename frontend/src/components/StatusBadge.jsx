import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Truck,
  Box,
  PackageCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const StatusBadge = ({
  status,
  size = "md",
  showIcon = true,
  animate = false,
}) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "created":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Box,
          label: "Created",
        };
      case "packed":
        return {
          color: "bg-primary/10 text-primary-dim border-primary/20",
          icon: PackageCheck,
          label: "Packed",
        };
      case "safe":
        return {
          color: "bg-safe/10 text-emerald-600 border-safe/20",
          icon: CheckCircle,
          label: "Safe",
        };
      case "risk":
        return {
          color: "bg-minor/10 text-amber-600 border-minor/20",
          icon: AlertTriangle,
          label: "Risk",
        };
      case "in_transit":
      case "in transit":
        return {
          color: "bg-secondary/10 text-secondary-dim border-secondary/20",
          icon: Truck,
          label: "In Transit",
        };
      case "out_for_delivery":
      case "out for delivery":
        return {
          color: "bg-secondary/10 text-secondary-dim border-secondary/20",
          icon: Truck,
          label: "Out For Delivery",
        };
      case "warning":
      case "minor":
      case "moderate":
        return {
          color: "bg-minor/10 text-amber-600 border-minor/20",
          icon: AlertTriangle,
          label: "Warning",
        };
      case "damaged":
      case "severe":
        return {
          color: "bg-severe/10 text-red-600 border-severe/20",
          icon: AlertCircle,
          label: "Damaged",
          glow: false,
        };
      case "delivered":
        return {
          color: "bg-safe/20 text-emerald-700 border-safe/30",
          icon: CheckCircle,
          label: "Delivered",
          glow: false,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-500 border-gray-200",
          icon: CheckCircle,
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const BadgeContent = (
    <div
      className={`status-badge ${config.color} ${sizeClasses[size]} border ${
        config.glow ? "animate-pulse-glow" : ""
      }`}
    >
      {showIcon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      <span>{config.label}</span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
};

export default StatusBadge;
