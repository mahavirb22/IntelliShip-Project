const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
