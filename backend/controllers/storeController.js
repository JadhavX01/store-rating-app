const db = require('../config/db');

// 🧠 Get All Stores With Ratings (+ search)
const getAllStoresWithRatings = (req, res) => {
  const { user_id, search } = req.query;

  let baseQuery = `
    SELECT 
      s.id AS store_id,
      s.name AS store_name,
      s.address,
      ROUND(AVG(r.rating_value), 1) AS average_rating,
      (
        SELECT rating_value 
        FROM ratings 
        WHERE user_id = ? AND store_id = s.id
      ) AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
  `;

  const params = [user_id];

  if (search) {
    baseQuery += ` WHERE s.name LIKE ? OR s.address LIKE ?`;
    params.push(`%${search}%`, `%${search}%`);
  }

  baseQuery += ` GROUP BY s.id`;

  db.query(baseQuery, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    return res.status(200).json(results);
  });
};

// ✅ Get Store By ID
const getStoreById = (req, res) => {
  const storeId = req.params.id;

  db.query('SELECT * FROM stores WHERE id = ?', [storeId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Store not found' });
    res.status(200).json(results[0]);
  });
};

// ✅ Add Store
const addStore = (req, res) => {
  const { name, address } = req.body;

  console.log('🟢 Add Store Payload:', req.body); // ⬅️ For debugging

  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required' });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const sql = 'INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)';
  db.query(sql, [name, address, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    res.status(201).json({ message: 'Store added successfully', storeId: result.insertId });
  });
};

// ✅ Update Store
const updateStore = (req, res) => {
  const { name, address } = req.body;
  const storeId = req.params.id;

  if (!name || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'UPDATE stores SET name = ?, address = ? WHERE id = ?';
  db.query(sql, [name, address, storeId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update store', details: err });
    res.json({ message: 'Store updated successfully' });
  });
};

// ✅ Delete Store
const deleteStore = (req, res) => {
  const storeId = req.params.id;

  const sql = 'DELETE FROM stores WHERE id = ?';
  db.query(sql, [storeId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete store' });
    res.json({ message: 'Store deleted successfully' });
  });
};

// ✅ Get Stores Owned by a Specific Owner
const getStoresByOwner = (req, res) => {
  const ownerId = req.params.ownerId;

  const query = 'SELECT id, name, address FROM stores WHERE owner_id = ?';
  db.query(query, [ownerId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json(results);
  });
};

module.exports = {
  getAllStoresWithRatings,
  getStoreById,
  addStore,
  updateStore,
  deleteStore,
  getStoresByOwner
};
