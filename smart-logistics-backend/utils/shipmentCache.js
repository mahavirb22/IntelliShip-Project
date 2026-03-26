const shipmentCache = new Map();
const CACHE_TTL_MS = Number(process.env.SHIPMENT_CACHE_TTL_MS || 10000);

const buildShipmentCacheKey = ({ shipmentId, mobile }) => {
  const normalizedShipmentId = String(shipmentId || "").trim();
  const normalizedMobile = String(mobile || "")
    .replace(/\D/g, "")
    .trim();

  return `${normalizedShipmentId}::${normalizedMobile || "public"}`;
};

const getShipmentCache = (cacheKey) => {
  const entry = shipmentCache.get(cacheKey);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    clearTimeout(entry.timer);
    shipmentCache.delete(cacheKey);
    return null;
  }

  return entry.data;
};

const setShipmentCache = (cacheKey, data) => {
  const existing = shipmentCache.get(cacheKey);
  if (existing?.timer) {
    clearTimeout(existing.timer);
  }

  const timer = setTimeout(() => {
    shipmentCache.delete(cacheKey);
  }, CACHE_TTL_MS);

  shipmentCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
    timer,
  });
};

const invalidateShipmentCache = (shipmentId) => {
  const normalizedShipmentId = String(shipmentId || "").trim();
  if (!normalizedShipmentId) {
    return;
  }

  for (const [key, value] of shipmentCache.entries()) {
    if (key.startsWith(`${normalizedShipmentId}::`)) {
      clearTimeout(value.timer);
      shipmentCache.delete(key);
    }
  }
};

module.exports = {
  buildShipmentCacheKey,
  getShipmentCache,
  setShipmentCache,
  invalidateShipmentCache,
};
