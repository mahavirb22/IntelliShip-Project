const calculateShipmentStatus = (events = [], monitoringStarted = false) => {
  const normalizedEvents = events
    .map((event) => String(event || "").toLowerCase())
    .filter(Boolean);

  const hasSevere = normalizedEvents.some((eventType) =>
    ["severe", "critical"].includes(eventType),
  );
  if (hasSevere) {
    return "WARNING";
  }

  const hasMinor = normalizedEvents.some((eventType) =>
    ["minor", "moderate", "warning"].includes(eventType),
  );
  if (hasMinor) {
    return "WARNING";
  }

  if (monitoringStarted) {
    return "IN_TRANSIT";
  }

  return "SAFE";
};

module.exports = { calculateShipmentStatus };
