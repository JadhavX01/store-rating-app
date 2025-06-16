const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe); // 👈 Important

module.exports = router;
