import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../services/authService';
import LoadingSpinner from './LoadingSpinner';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      setSuccess(true);
      setLoading(false);
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to save and organize your favorite articles</p>
        </div>
        
        {success ? (
          <div className="success-message">
            <h3>🎉 Account Created Successfully!</h3>
            <p>Your account has been created. You can now log in with your credentials.</p>
            <div className="success-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSuccess(false)}
              >
                Create Another Account
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={password.length >= 8 ? 'valid' : 'invalid'}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? 'valid' : 'invalid'}>
                    One number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : 'invalid'}>
                    One special character
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <div className="error-message">Passwords do not match</div>
              )}
            </div>
            
            <div className="auth-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner size="small" color="#ffffff" />
                    <span style={{ marginLeft: '8px' }}>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
              
              <Link to="/login" className="secondary-button">
                Already have an account? Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register; 