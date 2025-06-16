const db = require('../config/db');

const getOwnerDashboard  = (req, res) => {
  const ownerId = req.user.id;

  // Step 1: Get the store owned by this user
  db.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId], (err, storeResult) => {
    if (err) return res.status(500).json({ error: err });
    if (storeResult.length === 0) return res.status(404).json({ message: 'No store found for this owner.' });

    const storeId = storeResult[0].id;

    // Step 2: Get ratings for this store
    const query = `
      SELECT u.name, u.email, r.rating_value AS rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    db.query(query, [storeId], (err, ratingsResult) => {
      if (err) return res.status(500).json({ error: err });

      const averageRating =
        ratingsResult.length > 0
          ? (ratingsResult.reduce((sum, r) => sum + r.rating, 0) / ratingsResult.length).toFixed(2)
          : null;

      res.json({
        averageRating,
        ratings: ratingsResult
      });
    });
  });
};

module.exports = { getOwnerDashboard  };
