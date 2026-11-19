/**
 * Health check controller
 */
function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'coy-backend',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
