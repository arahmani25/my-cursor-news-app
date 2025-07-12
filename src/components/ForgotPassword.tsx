import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendPasswordResetEmail } from '../services/emailService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // First check if email exists
      await forgotPassword(email);
      
      // Then send the reset email using the main EmailJS function
      const result = await sendPasswordResetEmail(email, email.split('@')[0]);
      
      setSuccess('Password reset instructions have been sent to your email address');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await sendPasswordResetEmail(email, email.split('@')[0]);
      setSuccess('Reset email has been resent to your email address');
    } catch (err: any) {
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Check Your Email</h2>
            <p>We've sent password reset instructions to:</p>
            <p className="email-display">{email}</p>
          </div>
          
          <div className="auth-content">
            <div className="success-message">
              <p>If you don't see the email, check your spam folder or try resending it.</p>
              <p><strong>For testing:</strong> Check the browser console or alert for the reset link.</p>
            </div>
            
            <div className="auth-actions">
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="primary-button"
              >
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button>
              
              <Link to="/login" className="secondary-button">
                Back to Login
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
          <h2>Forgot Password</h2>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="auth-actions">
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="primary-button"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword; 