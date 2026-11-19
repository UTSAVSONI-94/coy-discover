const db = require('../database/connection');
const swipeRepository = require('../repositories/swipeRepository');
const matchRepository = require('../repositories/matchRepository');
const profileRepository = require('../repositories/profileRepository');
const CONSTANTS = require('../config/constants');

const swipeService = {
  /**
   * Record a LIKE or PASS swipe action and resolve mutual matching atomically.
   */
  recordSwipe(swiperId, targetProfileId, rawAction) {
    const profileId = parseInt(targetProfileId, 10);
    if (!profileId || isNaN(profileId)) {
      const err = new Error('Invalid profile ID provided.');
      err.status = 400;
      throw err;
    }

    if (profileId === swiperId) {
      const err = new Error('You cannot swipe on your own profile.');
      err.status = 400;
      throw err;
    }

    const action = String(rawAction || '').trim().toUpperCase();
    if (action !== CONSTANTS.SWIPE_ACTIONS.LIKE && action !== CONSTANTS.SWIPE_ACTIONS.PASS) {
      const err = new Error(`Invalid action '${rawAction}'. Allowed actions are 'LIKE' or 'PASS'.`);
      err.status = 400;
      throw err;
    }

    // Verify target profile exists
    const targetProfile = profileRepository.getProfileById(profileId);
    if (!targetProfile) {
      const err = new Error('Profile not found.');
      err.status = 404;
      throw err;
    }

    // Verify user has not already swiped on this profile
    const existingSwipe = swipeRepository.findSwipe(swiperId, profileId);
    if (existingSwipe) {
      const err = new Error('You have already swiped on this profile.');
      err.status = 409;
      throw err;
    }

    // Execute swipe and potential match creation inside a database transaction
    const executeSwipeTransaction = db.transaction(() => {
      // 1. Record the swipe
      swipeRepository.createSwipe(swiperId, profileId, action);

      // 2. If PASS, there is never a match
      if (action === CONSTANTS.SWIPE_ACTIONS.PASS) {
        return {
          success: true,
          action: CONSTANTS.SWIPE_ACTIONS.PASS,
          isMatch: false,
        };
      }

      // 3. If LIKE, check if target profile has already liked the swiper
      const hasLikedSwiper = swipeRepository.hasLikedUser(profileId, swiperId);

      if (hasLikedSwiper) {
        // Mutual like! Create match atomically
        const matchRecord = matchRepository.createMatch(swiperId, profileId);

        return {
          success: true,
          action: CONSTANTS.SWIPE_ACTIONS.LIKE,
          isMatch: true,
          match: {
            id: matchRecord.id,
            profile: {
              id: targetProfile.id,
              name: targetProfile.name,
              age: targetProfile.age,
              photo: targetProfile.photo,
              bio: targetProfile.bio,
              location: targetProfile.location,
              interests: targetProfile.interests,
            },
          },
        };
      }

      // 4. One-sided like (target has not liked yet)
      return {
        success: true,
        action: CONSTANTS.SWIPE_ACTIONS.LIKE,
        isMatch: false,
      };
    });

    return executeSwipeTransaction();
  },
};

module.exports = swipeService;
