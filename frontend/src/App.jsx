// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminStorePage from './pages/AdminStorePage';
import OwnerDashboard from './pages/OwnerDashboard';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddStorePage from './pages/AddStorePage';
import EditStorePage from './pages/EditStorePage';
import AdminUsersPage from './pages/AdminUsersPage'; // ✅ Correct one to keep

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🛠 Admin Routes */}
        <Route path="/admin/stores" element={<AdminStorePage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} /> {/* ✅ Keep only this one */}

        {/* 🏪 Owner Route */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-store" element={<AddStorePage />} />
        <Route path="/owner/edit-store/:id" element={<EditStorePage />} />

        {/* 👤 User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/me" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
