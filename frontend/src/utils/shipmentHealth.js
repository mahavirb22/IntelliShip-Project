const getSeverityPriority = (severity) => {
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  return 1;
};

export const getHighestSeverityFromEvents = (events = []) => {
  if (!Array.isArray(events) || events.length === 0) {
    return "LOW";
  }

  return events.reduce((highest, event) => {
    const current = String(event?.severity || "LOW").toUpperCase();
    return getSeverityPriority(current) > getSeverityPriority(highest)
      ? current
      : highest;
  }, "LOW");
};

const hasHighSignalInLogs = (logs = []) => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return false;
  }

  return logs.some((log) => {
    const message = String(log?.message || "").toLowerCase();
    return (
      message.includes("high vibration") ||
      message.includes("critical") ||
      message.includes("damaged")
    );
  });
};

export const getShipmentHealthStatus = ({
  shipment,
  events = [],
  logs = [],
}) => {
  const highestSeverity = getHighestSeverityFromEvents(events);
  if (highestSeverity === "HIGH") {
    return "DAMAGED";
  }

  if (hasHighSignalInLogs(logs)) {
    return "DAMAGED";
  }

  const shipmentStatus = String(shipment?.status || "").toUpperCase();
  const shipmentCondition = String(shipment?.condition || "").toUpperCase();

  if (shipmentStatus === "DAMAGED" || shipmentCondition === "DAMAGED") {
    return "DAMAGED";
  }

  return "SAFE";
};
