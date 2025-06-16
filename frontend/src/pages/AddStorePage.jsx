import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStorePage = () => {
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Name and address are required.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/stores', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('✅ Store added successfully!');
      setError('');
      setFormData({ name: '', address: '' });

      setTimeout(() => navigate('/owner/dashboard'), 1500);
    } catch (err) {
      console.error('Error adding store:', err);
      setError(err.response?.data?.error || '❌ Failed to add store');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4 text-primary">➕ Add New Store</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Store Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter store name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Store Address</label>
                <input
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="Enter store address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Add Store
              </button>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && <div className="alert alert-success mt-3">{success}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStorePage;
