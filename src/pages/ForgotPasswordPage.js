import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    try {
      const res = await axios.post('/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleSubmit}>Send Reset Link</button>
        {message && <p>{message}</p>}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-to-login-btn"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
