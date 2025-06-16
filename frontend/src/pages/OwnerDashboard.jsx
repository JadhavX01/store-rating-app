import React, { useEffect, useState } from 'react';
import ownerAPI from '../services/ownerAPI';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchOwnerStores();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await ownerAPI.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err?.response?.data?.message || 'Error loading dashboard');
    }
  };

  const fetchOwnerStores = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/api/stores/owner/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) {
      console.error('Store fetch error:', err);
      setError(err?.response?.data?.message || 'Failed to fetch stores');
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(prev => prev.filter(s => s.id !== storeId));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err?.response?.data?.message || 'Failed to delete store');
    }
  };

  const handleEdit = (storeId) => {
    navigate(`/owner/edit-store/${storeId}`);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🏪 Owner Dashboard</h2>
        <Link to="/owner/add-store" className="btn btn-success">
          ➕ Add New Store
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Dashboard Ratings */}
      {dashboard ? (
        <div className="mb-5">
          <h4 className="text-primary mb-3">📊 Store Ratings</h4>
          <p className="mb-2">
            <strong>Average Rating:</strong> {dashboard.averageRating || 'No ratings yet'}
          </p>

          {dashboard.ratings && dashboard.ratings.length > 0 ? (
            <div className="card p-3">
              {dashboard.ratings.map((r, i) => (
                <div key={i} className="border-bottom py-2">
                  <strong>{r.name}</strong> ({r.email}) rated: <strong>{r.rating}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No user ratings yet.</p>
          )}
        </div>
      ) : (
        <p>Loading dashboard...</p>
      )}

      {/* Stores List */}
      <h4 className="mb-3">🛒 Your Stores</h4>
      {stores.length > 0 ? (
        <div className="row g-3">
          {stores.map((store) => (
            <div key={store.id} className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{store.name}</h5>
                  <p className="card-text text-muted">{store.address}</p>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleEdit(store.id)}
                      className="btn btn-warning btn-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">You haven’t added any stores yet.</p>
      )}
    </div>
  );
};

export default OwnerDashboard;
