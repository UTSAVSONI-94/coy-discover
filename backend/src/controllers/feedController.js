const feedService = require('../services/feedService');
const CONSTANTS = require('../config/constants');

/**
 * Controller for GET /api/feed
 */
async function getFeed(req, res, next) {
  try {
    const profiles = feedService.getFeed(CONSTANTS.DEMO_USER_ID);
    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getFeed,
};

