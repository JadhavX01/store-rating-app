const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const storeRoutes = require('./routes/storeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use('/api/auth', authRoutes);       // 🔐 Auth routes: register, login, me
app.use('/api/ratings', ratingRoutes); // ⭐ Rating routes: submit, view
app.use('/api/stores', storeRoutes);   // 🏬 Store list + search
app.use('/api/admin', adminRoutes);    // 👑 Admin dashboard
app.use('/api/owner', ownerRoutes);    // 🧑‍💼 Owner dashboard

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.send('🌐 Store Rating API is up and running!');
});

// ===== ERROR HANDLING (OPTIONAL) =====
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
