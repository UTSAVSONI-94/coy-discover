const profileRepository = require('../repositories/profileRepository');

function getFeed(userId) {
  return profileRepository.getFeedProfiles(userId);
}

module.exports = {
  getFeed,
};
