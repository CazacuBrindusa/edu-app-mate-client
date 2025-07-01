import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await axios.post('/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button onClick={handleReset}>Reset</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
