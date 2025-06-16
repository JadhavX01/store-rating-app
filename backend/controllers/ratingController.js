const db = require('../config/db');

// ✅ Submit or Update Rating
const submitOrUpdateRating = (req, res) => {
  const user_id = req.user.id;            // get user ID from token
  const { store_id, rating_value } = req.body;

  if (!store_id || rating_value == null) {
    return res.status(400).json({ message: 'store_id and rating_value are required.' });
  }
  if (rating_value < 1 || rating_value > 5) {
    return res.status(400).json({ message: 'rating_value must be between 1 and 5.' });
  }

  const query = `
    INSERT INTO ratings (user_id, store_id, rating_value)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating_value = ?
  `;
  db.query(query, [user_id, store_id, rating_value, rating_value], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    return res.status(200).json({ message: 'Rating submitted/updated successfully' });
  });
};

// ✅ Get All Ratings By Logged-in User
const getUserRatings = (req, res) => {
  const user_id = req.user.id;            // get user ID from token

  const sql = `
    SELECT r.store_id, s.name AS store_name, s.address, r.rating_value
    FROM ratings r
    JOIN stores s ON r.store_id = s.id
    WHERE r.user_id = ?
  `;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ratings', error: err });
    return res.status(200).json(results);
  });
};

module.exports = {
  submitOrUpdateRating,
  getUserRatings
};
