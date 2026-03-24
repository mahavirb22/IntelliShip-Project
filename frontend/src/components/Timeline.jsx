import React from "react";
import { motion } from "framer-motion";

const Timeline = ({ logs }) => {
  const normalizedLogs = Array.isArray(logs)
    ? [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  if (normalizedLogs.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <p className="text-gray-400">No logs recorded yet</p>
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
      return "bg-severe/20 text-severe border-severe/50";
    }
    if (normalized === "MANUAL") {
      return "bg-blue-500/20 text-blue-300 border-blue-400/50";
    }
    return "bg-safe/20 text-safe border-safe/50";
  };

  return (
    <div className="glass-card overflow-x-auto">
      <div className="min-w-[540px]">
        <div className="grid grid-cols-12 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
          <p className="col-span-4">Time</p>
          <p className="col-span-6">Message</p>
          <p className="col-span-2">Type</p>
        </div>

        <div className="divide-y divide-white/10">
          {normalizedLogs.map((log, index) => (
            <motion.div
              key={`${log.timestamp}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="grid grid-cols-12 px-4 py-4 text-sm"
            >
              <p className="col-span-4 text-gray-300">
                {formatTime(log.timestamp)}
              </p>
              <p className="col-span-6 font-medium">{log.message}</p>
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
