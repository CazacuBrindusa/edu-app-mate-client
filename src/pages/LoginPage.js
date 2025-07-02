import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    let userType;
    if (email.endsWith('@prof.com')) {
      userType = 'professor';
    } else if (email.endsWith('@stud.com')) {
      userType = 'student';
    } else {
      setError('Invalid email domain');
      return;
    }

    try {
      const requestBody = { email: email.trim(), password: password.trim(), userType };

      const response = await axios.post('/login', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { token } = response.data;

      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);

      if (decodedToken.userType === 'professor') {
        navigate('/professor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form
        className="form-wrapper"
        onSubmit={e => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
        <button
          type="button"
          className="forgot-password-link"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
