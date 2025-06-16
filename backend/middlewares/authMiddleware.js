// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🔐 Check if token is valid
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token not found
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 🔐 Restrict by role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Forbidden role' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
