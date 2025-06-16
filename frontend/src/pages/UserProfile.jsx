import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../utils/logout';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setUser(res.data))
    .catch(() => setError('Failed to fetch user data'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">👤 My Profile</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {user ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-xl font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-xl font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-xl font-medium text-gray-900 capitalize">{user.role}</p>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          !error && <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
