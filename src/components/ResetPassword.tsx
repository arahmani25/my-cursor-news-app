import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../services/authService';
import { validateResetToken, removeResetToken } from '../services/emailService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetUserPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate the reset token
    const validateToken = async () => {
      try {
        if (!token) {
          setError('Invalid reset link - missing token');
          setIsCheckingToken(false);
          return;
        }

        // Validate the token using our email service
        const emailFromToken = validateResetToken(token);
        
        if (!emailFromToken) {
          setError('Invalid or expired reset link');
          setIsCheckingToken(false);
          return;
        }

        // Check if the email in URL matches the token
        if (email && emailFromToken !== email) {
          setError('Invalid reset link - email mismatch');
          setIsCheckingToken(false);
          return;
        }

        setIsValidToken(true);
        setUserEmail(emailFromToken);
      } catch (err) {
        setError('Failed to validate reset link');
      } finally {
        setIsCheckingToken(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }

    if (!userEmail) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetUserPassword(userEmail, password);
      
      // Remove the used token
      if (token) {
        removeResetToken(token);
      }
      
      setSuccess('Password has been reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Validating Reset Link</h2>
            <p>Please wait while we verify your reset link...</p>
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Invalid Reset Link</h2>
            <p>The password reset link is invalid or has expired.</p>
          </div>
          
          <div className="auth-content">
            <div className="error-message">
              <p>Please request a new password reset link.</p>
            </div>
            
            <div className="auth-actions">
              <Link to="/forgot-password" className="primary-button">
                Request New Reset Link
              </Link>
              
              <Link to="/login" className="secondary-button">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Password Reset Successful</h2>
            <p>Your password has been reset successfully!</p>
          </div>
          
          <div className="auth-content">
            <div className="success-message">
              <p>You will be redirected to the login page shortly.</p>
            </div>
            
            <div className="auth-actions">
              <Link to="/login" className="primary-button">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Your Password</h2>
          <p>Enter your new password below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="form-input"
              disabled={isLoading}
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
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="form-input"
              disabled={isLoading}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="error-message">Passwords do not match</div>
            )}
          </div>
          
          <div className="auth-actions">
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className="primary-button"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <Link to="/login" className="secondary-button">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 