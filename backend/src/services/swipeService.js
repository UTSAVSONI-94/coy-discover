const db = require('../database/connection');
const swipeRepository = require('../repositories/swipeRepository');
const matchRepository = require('../repositories/matchRepository');
const profileRepository = require('../repositories/profileRepository');
const { SWIPE_ACTIONS } = require('../config/constants');

function recordSwipe(swiperId, targetProfileId, rawAction) {
  const profileId = parseInt(targetProfileId, 10);
  if (!profileId || isNaN(profileId)) {
    const err = new Error('Invalid profile ID provided');
    err.status = 400;
    throw err;
  }

  if (profileId === swiperId) {
    const err = new Error('Cannot swipe on your own profile');
    err.status = 400;
    throw err;
  }

  const action = String(rawAction || '').trim().toUpperCase();
  if (action !== SWIPE_ACTIONS.LIKE && action !== SWIPE_ACTIONS.PASS) {
    const err = new Error(`Invalid action '${rawAction}'. Must be LIKE or PASS.`);
    err.status = 400;
    throw err;
  }

  const targetProfile = profileRepository.getProfileById(profileId);
  if (!targetProfile) {
    const err = new Error('Profile not found');
    err.status = 404;
    throw err;
  }

  const existingSwipe = swipeRepository.findSwipe(swiperId, profileId);
  if (existingSwipe) {
    const err = new Error('You have already swiped on this profile');
    err.status = 409;
    throw err;
  }

  const swipeTx = db.transaction(() => {
    swipeRepository.createSwipe(swiperId, profileId, action);

    if (action === SWIPE_ACTIONS.PASS) {
      return {
        success: true,
        action: SWIPE_ACTIONS.PASS,
        isMatch: false,
      };
    }

    const isMutual = swipeRepository.hasLikedUser(profileId, swiperId);

    if (isMutual) {
      const match = matchRepository.createMatch(swiperId, profileId);
      return {
        success: true,
        action: SWIPE_ACTIONS.LIKE,
        isMatch: true,
        match: {
          id: match.id,
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

    return {
      success: true,
      action: SWIPE_ACTIONS.LIKE,
      isMatch: false,
    };
  });

  try {
    return swipeTx();
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      const conflictErr = new Error('You have already swiped on this profile');
      conflictErr.status = 409;
      throw conflictErr;
    }
    throw err;
  }
}

module.exports = {
  recordSwipe,
};
