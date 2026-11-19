const profileRepository = require('../repositories/profileRepository');

const feedService = {
  /**
   * Get unswiped feed profiles for the given user.
   */
  getFeed(userId) {
    return profileRepository.getFeedProfiles(userId);
  },
};

module.exports = feedService;
