import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess('🎉 Registration successful! Redirecting to login...');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="card shadow-lg p-4 rounded-3 border-0" style={{ 
        maxWidth: '450px', 
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ 
            color: '#4e73df',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <i className="bi bi-person-plus-fill me-2"></i>
            Create New Account
          </h3>
          <p className="text-muted">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { field: 'name', label: 'Full Name', icon: 'bi-person' },
            { field: 'email', label: 'Email Address', icon: 'bi-envelope' },
            { field: 'address', label: 'Address', icon: 'bi-geo-alt' },
            { field: 'password', label: 'Password', icon: 'bi-lock', type: 'password' }
          ].map(({ field, label, icon, type = 'text' }) => (
            <div className="mb-3" key={field}>
              <label htmlFor={field} className="form-label fw-medium" style={{ color: '#4e73df' }}>
                <i className={`bi ${icon} me-2`}></i>
                {label}
              </label>
              <input
                id={field}
                name={field}
                type={type}
                className="form-control py-2"
                placeholder={`Enter ${label.toLowerCase()}`}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  borderColor: '#d1d3e2',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="role" className="form-label fw-medium" style={{ color: '#4e73df' }}>
              <i className="bi bi-person-badge me-2"></i>
              Account Type
            </label>
            <select
              id="role"
              name="role"
              className="form-select py-2"
              value={formData.role}
              onChange={handleChange}
              style={{
                borderColor: '#d1d3e2',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-danger text-center py-2 mb-3" role="alert" style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderColor: '#f5c6cb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success text-center py-2 mb-3" role="alert" style={{
              backgroundColor: '#d1e7dd',
              color: '#0f5132',
              borderColor: '#badbcc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="btn w-100 py-2 fw-medium mb-3" 
            disabled={isLoading}
            style={{
              backgroundColor: '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(78, 115, 223, 0.3)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(to right, #4e73df 0%, #224abe 100%)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </>
            )}
          </button>

          <div className="text-center">
            <p className="small" style={{ color: '#5a5c69' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-decoration-none fw-medium" 
                style={{
                  color: '#4e73df',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;