import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, sortBy, order }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('❌ Failed to delete user.');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">👥 Admin Users</h2>

      {/* Filters */}
      <div className="row g-3 mb-4">
        {['name', 'email', 'role', 'address'].map((field, idx) => (
          <div className="col-sm-6 col-md-3" key={idx}>
            <input
              type="text"
              name={field}
              className="form-control"
              placeholder={`Search ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <div className="col-sm-6 col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>
        </div>
        <div className="col-sm-6 col-md-3">
          <select
            className="form-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-capitalize">{user.role}</td>
                  <td>{user.address}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
