import React from "react";
import { motion } from "framer-motion";

const Timeline = ({ logs }) => {
  const normalizedLogs = Array.isArray(logs)
    ? [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  if (normalizedLogs.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <p className="text-on-surface-variant">No logs recorded yet</p>
      </div>
    );
  }

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const getBadge = (type) => {
    const normalized = String(type || "").toUpperCase();
    if (normalized === "EVENT") {
      return "bg-severe/10 text-red-600 border-severe/20";
    }
    if (normalized === "MANUAL") {
      return "bg-primary/10 text-primary-dim border-primary/20";
    }
    return "bg-safe/10 text-emerald-600 border-safe/20";
  };

  return (
    <div className="glass-card overflow-x-auto bg-white p-0">
      <div className="min-w-[540px]">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 text-xs uppercase tracking-wider font-semibold text-on-surface-variant bg-gray-50/50 rounded-t-2xl">
          <p className="col-span-4">Time</p>
          <p className="col-span-6">Message</p>
          <p className="col-span-2">Type</p>
        </div>

        <div className="divide-y divide-gray-100">
          {normalizedLogs.map((log, index) => (
            <motion.div
              key={`${log.timestamp}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="grid grid-cols-12 px-6 py-4 text-sm hover:bg-gray-50/50 transition-colors"
            >
              <p className="col-span-4 text-on-surface-variant">
                {formatTime(log.timestamp)}
              </p>
              <p className="col-span-6 font-medium text-on-surface">{log.message}</p>
              <div className="col-span-2">
                <span
                  className={`px-2 py-1 rounded-full border text-xs font-semibold ${getBadge(log.type)}`}
                >
                  {String(log.type || "SYSTEM").toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
