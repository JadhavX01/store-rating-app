import React from 'react';
import { logout } from '../utils/logout';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">🏪 Store Rating App</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
