const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ 1. Dashboard Stats
const getDashboardStats = (req, res) => {
  const stats = { users: 0, stores: 0, ratings: 0 };

  db.query('SELECT COUNT(*) AS total FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    stats.users = result[0].total;

    db.query('SELECT COUNT(*) AS total FROM stores', (err, result) => {
      if (err) return res.status(500).json({ error: err });
      stats.stores = result[0].total;

      db.query('SELECT COUNT(*) AS total FROM ratings', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        stats.ratings = result[0].total;

        return res.json(stats);
      });
    });
  });
};

// ✅ 2. Add New User (Admin Only)
const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding user', error: err });
        return res.status(201).json({ message: 'User added successfully' });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Password hashing failed', error: err });
  }
};

// ✅ 3. Get All Users
const getAllUsers = (req, res) => {
  const {
    name = '',
    email = '',
    role = '',
    address = '',
    sortBy = 'name',
    order = 'asc'
  } = req.query;

  const validSorts = ['name', 'email', 'role', 'address'];
  const sortField = validSorts.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const query = `
    SELECT id, name, email, address, role
    FROM users
    WHERE name LIKE ? AND email LIKE ? AND role LIKE ? AND address LIKE ?
    ORDER BY ${sortField} ${sortOrder}
  `;

  db.query(
    query,
    [`%${name}%`, `%${email}%`, `%${role}%`, `%${address}%`],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
      res.json(results);
    }
  );
};

// ✅ 4. Get All Stores with Ratings and Owner Info
const getAllStores = (req, res) => {
  const {
    name = '',
    email = '',
    address = '',
    sortBy = 'name',
    order = 'asc'
  } = req.query;

  const validSorts = ['name', 'email', 'address'];
  const sortField = validSorts.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  let query = `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating_value), 2) AS rating,
      u.name AS owner_name,
      u.email AS owner_email
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (name) {
    query += ` AND s.name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (email) {
    query += ` AND s.email LIKE ?`;
    params.push(`%${email}%`);
  }

  if (address) {
    query += ` AND s.address LIKE ?`;
    params.push(`%${address}%`);
  }

  query += ` GROUP BY s.id ORDER BY s.${sortField} ${sortOrder}`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ SQL Error:', err);
      return res.status(500).json({ message: 'Error fetching stores', error: err });
    }
    res.json(results);
  });
};

// ✅ 5. Delete Store by ID
const deleteStore = (req, res) => {
  const storeId = req.params.id;

  db.query('DELETE FROM stores WHERE id = ?', [storeId], (err, result) => {
    if (err) {
      console.error('❌ Failed to delete store:', err);
      return res.status(500).json({ message: 'Failed to delete store', error: err });
    }
    res.json({ message: 'Store deleted successfully' });
  });
};

// ✅ 6. Delete User by ID
const deleteUser = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: 'Missing user ID' });
  }

  // Step 1: Delete all ratings made by the user
  db.query('DELETE FROM ratings WHERE user_id = ?', [userId], (err1) => {
    if (err1) {
      console.error('❌ Error deleting user ratings:', err1);
      return res.status(500).json({ message: 'Error deleting user ratings', error: err1 });
    }

    // Step 2: Get all store IDs owned by this user
    db.query('SELECT id FROM stores WHERE owner_id = ?', [userId], (err2, stores) => {
      if (err2) {
        console.error('❌ Error fetching user stores:', err2);
        return res.status(500).json({ message: 'Error fetching stores', error: err2 });
      }

      const storeIds = stores.map(store => store.id);

      if (storeIds.length === 0) {
        return deleteUserFinalStep(userId, res);
      }

      // Step 3: Delete ratings for each of those stores
      db.query('DELETE FROM ratings WHERE store_id IN (?)', [storeIds], (err3) => {
        if (err3) {
          console.error('❌ Error deleting ratings for user stores:', err3);
          return res.status(500).json({ message: 'Error deleting store ratings', error: err3 });
        }

        // Step 4: Delete the stores owned by the user
        db.query('DELETE FROM stores WHERE owner_id = ?', [userId], (err4) => {
          if (err4) {
            console.error('❌ Error deleting stores:', err4);
            return res.status(500).json({ message: 'Error deleting stores', error: err4 });
          }

          // Step 5: Finally, delete the user
          return deleteUserFinalStep(userId, res);
        });
      });
    });
  });
};

// Final user delete step helper
function deleteUserFinalStep(userId, res) {
  db.query('DELETE FROM users WHERE id = ?', [userId], (err5, result) => {
    if (err5) {
      console.error('❌ Error deleting user:', err5);
      return res.status(500).json({ message: 'Error deleting user', error: err5 });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
}


module.exports = {
  getDashboardStats,
  addUser,
  getAllUsers,
  getAllStores,
  deleteStore,
  deleteUser
};
