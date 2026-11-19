const matchService = require('../services/matchService');
const CONSTANTS = require('../config/constants');

/**
 * Controller for GET /api/matches
 */
async function getMatches(req, res, next) {
  try {
    const matches = matchService.getMatches(CONSTANTS.DEMO_USER_ID);
    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMatches,
};

