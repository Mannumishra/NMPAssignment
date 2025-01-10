import React, { useState } from 'react';
import './Login.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/log-in',
        { email, password },
        { withCredentials: true }
      );
      console.log(response)
      if (response.status === 200) {
        toast.success('Login successful!');
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("userid", response.data.user.id);
        sessionStorage.setItem("role", response.data.user.role);
        window.location.href = '/dashboard';
      } else {
        toast.error(response.data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error("Login error:", error);
      // toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };


  return (
    <div className="main-login">
      <div className="login-container">
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
              <button
                type="button"
                className="show-password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="redirect-message mt-3">
          Don't have an account? <Link to="/sign-up">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
