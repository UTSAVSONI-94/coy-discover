const express = require('express');
const { getMatches } = require('../controllers/matchController');

const router = express.Router();

router.get('/matches', getMatches);

module.exports = router;

