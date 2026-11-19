const swipeService = require('../services/swipeService');
const { DEMO_USER_ID } = require('../config/constants');

async function postSwipe(req, res, next) {
  try {
    const { profileId, action } = req.body || {};

    if (!profileId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Both profileId and action are required',
      });
    }

    const result = swipeService.recordSwipe(DEMO_USER_ID, profileId, action);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  postSwipe,
};
