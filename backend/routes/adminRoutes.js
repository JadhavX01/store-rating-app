const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  addUser,
  getAllUsers,
  getAllStores,
  deleteStore,
  deleteUser
} = require('../controllers/adminController');

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// 👮 Admin-only protected routes
router.get('/dashboard/stats', verifyToken, authorizeRoles('admin'), getDashboardStats);
router.post('/users', verifyToken, authorizeRoles('admin'), addUser);
router.get('/users', verifyToken, authorizeRoles('admin'), getAllUsers);
router.get('/stores', verifyToken, authorizeRoles('admin'), getAllStores);
router.delete('/stores/:id', verifyToken, authorizeRoles('admin'), deleteStore);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteUser);

module.exports = router;
