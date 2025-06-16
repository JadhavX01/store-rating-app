import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;
      const role = user.role;

      // Store token, user, and role
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);

      // 🔍 Debugging (Optional)
      console.log('Login Success:', role);

      // Redirect based on role
      if (role === 'admin') navigate('/admin/users');
      else if (role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="card shadow-lg p-4 rounded-3 border-0" style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{
            color: '#4e73df',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <i className="bi bi-shield-lock-fill me-2"></i>
            Login to Your Account
          </h3>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium" style={{ color: '#4e73df' }}>Email address</label>
            <input
              type="email"
              className="form-control py-2"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderColor: '#d1d3e2',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-medium" style={{ color: '#4e73df' }}>Password</label>
            <input
              type="password"
              className="form-control py-2"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderColor: '#d1d3e2',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
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

          <button
            type="submit"
            className="btn w-100 py-2 fw-medium"
            style={{
              backgroundColor: '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(78, 115, 223, 0.3)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(to right, #4e73df 0%, #224abe 100%)'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="small" style={{ color: '#5a5c69' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-decoration-none fw-medium"
              style={{
                color: '#4e73df',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#224abe'}
              onMouseOut={(e) => e.target.style.color = '#4e73df'}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
