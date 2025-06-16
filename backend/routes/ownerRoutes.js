// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getOwnerDashboard } = require('../controllers/ownerController');

// Owner dashboard route
router.get('/dashboard', verifyToken, authorizeRoles('owner'), getOwnerDashboard);

module.exports = router;
// JSON.parse(localStorage.getItem('user'))
