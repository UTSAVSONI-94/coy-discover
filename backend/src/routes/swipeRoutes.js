const express = require('express');
const { postSwipe } = require('../controllers/swipeController');

const router = express.Router();

router.post('/swipe', postSwipe);

module.exports = router;

