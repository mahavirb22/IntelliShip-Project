import React from "react";
import { motion } from "framer-motion";
import { Clock, Activity, TrendingUp } from "lucide-react";
import StatusBadge from "./StatusBadge";

const EventCard = ({ event, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="glass-card hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Timeline Dot */}
      <div className="absolute -left-[50px] top-1/2 -translate-y-1/2 hidden md:block">
        <div
          className={`w-4 h-4 rounded-full ${
            event.event_type === "Severe"
              ? "bg-severe animate-pulse"
              : event.event_type === "Minor"
                ? "bg-minor"
                : "bg-safe"
          } border-4 border-gray-900`}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-on-surface-variant/60" />
          <span className="text-sm text-on-surface-variant">
            {formatDate(event.timestamp)}
          </span>
        </div>
        <StatusBadge status={event.event_type} size="sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/10 p-3 rounded-lg">
          <Activity size={20} className="text-primary" />
          <div>
            <p className="text-xs text-on-surface-variant/60">Rising Edges</p>
            <p className="text-lg font-bold">{event.risingEdges}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/10 p-3 rounded-lg">
          <TrendingUp size={20} className="text-minor" />
          <div>
            <p className="text-xs text-on-surface-variant/60">Avg High</p>
            <p className="text-lg font-bold">{event.avgHigh.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
