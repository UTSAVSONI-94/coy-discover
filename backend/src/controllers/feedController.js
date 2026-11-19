const feedService = require('../services/feedService');
const { DEMO_USER_ID } = require('../config/constants');

async function getFeed(req, res, next) {
  try {
    const profiles = feedService.getFeed(DEMO_USER_ID);
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
