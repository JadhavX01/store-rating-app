// src/pages/EditStorePage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStorePage = () => {
  const { id } = useParams(); // store ID from URL
  const [store, setStore] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStore(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load store');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setStore(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/stores/${id}`, store, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('✅ Store updated successfully!');
      setTimeout(() => navigate('/owner/dashboard'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-center mt-6">Loading store data...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">✏️ Edit Store</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Store Name"
          value={store.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address"
          type="text"
          placeholder="Store Address"
          value={store.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
          Update Store
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </form>
    </div>
  );
};

export default EditStorePage;
