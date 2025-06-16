const express = require('express');
const router = express.Router();
const { submitOrUpdateRating, getUserRatings } = require('../controllers/ratingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST or UPDATE rating (logged-in user)
router.post('/', verifyToken, submitOrUpdateRating);

// GET all ratings for logged-in user
router.get('/user', verifyToken, getUserRatings);

module.exports = router;
