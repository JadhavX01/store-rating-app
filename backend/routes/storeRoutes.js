const express = require('express');
const router = express.Router();

const {
  getAllStoresWithRatings,
  getStoreById,
  getStoresByOwner, // ✅ Fixed name here
  addStore,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// 🔓 Public: Get all stores with avg + user rating
router.get('/', getAllStoresWithRatings);

// 🔐 Get one store by ID (used for edit form)
router.get('/:id', verifyToken, getStoreById);

// 🔐 Get all stores created by owner
router.get('/owner/:ownerId', verifyToken, authorizeRoles('owner', 'admin'), getStoresByOwner); // ✅ Fixed name

// 🔐 Add a store (Admin or Owner)
router.post('/', verifyToken, authorizeRoles('admin', 'owner'), addStore);

// 🔐 Update a store by ID
router.put('/:id', verifyToken, authorizeRoles('admin', 'owner'), updateStore);

// 🔐 Delete a store by ID
router.delete('/:id', verifyToken, authorizeRoles('admin', 'owner'), deleteStore);

module.exports = router;
