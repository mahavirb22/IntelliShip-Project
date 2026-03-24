const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const sanitizeObject = (obj) => {
  if (!isObject(obj)) {
    return obj;
  }

  const cleaned = {};

  Object.keys(obj).forEach((key) => {
    if (key.startsWith("$") || key.includes(".")) {
      return;
    }

    const value = obj[key];

    if (Array.isArray(value)) {
      cleaned[key] = value.map((entry) =>
        isObject(entry) ? sanitizeObject(entry) : entry,
      );
    } else if (isObject(value)) {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

const sanitizeInputs = (req, res, next) => {
  if (req.body && isObject(req.body)) {
    req.body = sanitizeObject(req.body);
  }

  next();
};

module.exports = sanitizeInputs;
