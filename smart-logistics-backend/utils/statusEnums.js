const SHIPMENT_LIFECYCLE = [
  "CREATED",
  "PACKED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "VERIFIED",
  "COMPLETED",
];

const SHIPMENT_CONDITION = ["SAFE", "AT_RISK", "RISK", "DAMAGED"];

const EVENT_SEVERITY = ["LOW", "MEDIUM", "HIGH"];

const NEXT_STATUS_MAP = {
  CREATED: ["PACKED"],
  PACKED: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["VERIFIED"],
  VERIFIED: ["COMPLETED"],
  COMPLETED: [],
};

const isValidTransition = (currentStatus, nextStatus) => {
  const allowed = NEXT_STATUS_MAP[currentStatus] || [];
  return allowed.includes(nextStatus);
};

module.exports = {
  SHIPMENT_LIFECYCLE,
  SHIPMENT_CONDITION,
  EVENT_SEVERITY,
  NEXT_STATUS_MAP,
  isValidTransition,
};
