/**
 * Global JSON error handler middleware
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  // Log server errors for internal monitoring
  if (!isClientError) {
    console.error('[Internal Server Error]:', err);
  }

  // Safe message sanitization: never leak internal SQL syntax or stack traces to client
  const clientMessage = isClientError
    ? err.message
    : 'An unexpected internal error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
  });
}

module.exports = errorHandler;
