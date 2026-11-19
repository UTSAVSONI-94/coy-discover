const matchService = require('../services/matchService');
const { DEMO_USER_ID } = require('../config/constants');

async function getMatches(req, res, next) {
  try {
    const matches = matchService.getMatches(DEMO_USER_ID);
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
