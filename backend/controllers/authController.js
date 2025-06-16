// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, address, role || 'user'],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Insert failed', error: err });
          return res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Password encryption error', error });
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      });
    });

    if (!user) {
      console.log(`🔐 [Login] No user found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`🔐 [Login] Match: ${isMatch}, Email: ${email}`);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getMe = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(results[0]);
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
