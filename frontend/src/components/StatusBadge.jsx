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
          color: "bg-slate-500/20 text-slate-200 border-slate-400/50",
          icon: Box,
          label: "Created",
        };
      case "packed":
        return {
          color: "bg-cyan-500/20 text-cyan-200 border-cyan-400/50",
          icon: PackageCheck,
          label: "Packed",
        };
      case "safe":
        return {
          color: "bg-safe/20 text-safe border-safe/50",
          icon: CheckCircle,
          label: "Safe",
        };
      case "risk":
        return {
          color: "bg-minor/20 text-minor border-minor/50",
          icon: AlertTriangle,
          label: "Risk",
        };
      case "in_transit":
      case "in transit":
        return {
          color: "bg-blue-500/20 text-blue-300 border-blue-400/50",
          icon: Truck,
          label: "In Transit",
        };
      case "out_for_delivery":
      case "out for delivery":
        return {
          color: "bg-indigo-500/20 text-indigo-200 border-indigo-400/50",
          icon: Truck,
          label: "Out For Delivery",
        };
      case "warning":
      case "minor":
      case "moderate":
        return {
          color: "bg-minor/20 text-minor border-minor/50",
          icon: AlertTriangle,
          label: "Warning",
        };
      case "damaged":
      case "severe":
        return {
          color: "bg-severe/20 text-severe border-severe/50",
          icon: AlertCircle,
          label: "Damaged",
          glow: true,
        };
      case "delivered":
        return {
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50",
          icon: CheckCircle,
          label: "Delivered",
          glow: true,
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/50",
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
