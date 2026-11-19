const matchRepository = require('../repositories/matchRepository');

function getMatches(userId) {
  return matchRepository.getUserMatches(userId);
}

module.exports = {
  getMatches,
};
