import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.id) {
      setError('User not logged in.');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/stores?user_id=${user.id}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data || []);
    } catch (err) {
      console.error('Error loading stores:', err);
      setError('Failed to load stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleRatingChange = async (store_id, value) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.id) {
      setError('User not logged in.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/ratings', {
        user_id: user.id,
        store_id,
        rating_value: value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchStores(); // Refresh store data
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4 display-6">🧍 Normal User Dashboard</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search stores..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-control shadow-sm"
        />
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {stores.length > 0 ? (
        <div className="row g-4">
          {stores.map(store => (
            <div className="col-md-6" key={store.store_id}>
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">{store.store_name}</h5>
                  <p className="card-text text-muted">{store.address}</p>
                  <p className="card-text">
                    ⭐ <strong>Average Rating:</strong> {store.average_rating || 'Not rated yet'}
                  </p>
                  <div className="mt-3">
                    <label className="form-label">Your Rating:</label>
                    <select
                      value={store.user_rating || ''}
                      onChange={e => handleRatingChange(store.store_id, e.target.value)}
                      className="form-select"
                    >
                      <option value="">Rate</option>
                      {[1, 2, 3, 4, 5].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && <p className="text-center text-secondary mt-5">No stores found.</p>
      )}
    </div>
  );
};

export default UserDashboard;