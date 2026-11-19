function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;

  if (status >= 500) {
    console.error('Server error:', err);
  }

  res.status(status).json({
    success: false,
    error: status < 500 ? err.message : 'Internal server error',
  });
}

module.exports = errorHandler;
