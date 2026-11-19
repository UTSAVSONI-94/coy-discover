const matchRepository = require('../repositories/matchRepository');

const matchService = {
  /**
   * Get all mutual matches for the user.
   */
  getMatches(userId) {
    return matchRepository.getUserMatches(userId);
  },
};

module.exports = matchService;
