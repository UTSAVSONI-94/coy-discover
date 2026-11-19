/**
 * Global JSON error handler middleware
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[Unhandled Error]:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
