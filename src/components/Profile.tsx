import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../services/authService';

const Profile: React.FC = () => {
  const { user, updateUserProfile, changePassword, deactivateAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profileData.name, profileData.email);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!deactivateReason.trim()) {
      setError('Please provide a reason for deactivation');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await deactivateAccount(deactivateReason);
      setSuccess('Account deactivated successfully. You will be logged out.');
      setShowDeactivateModal(false);
      setDeactivateReason('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Profile Not Available</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <p>Manage your account settings and preferences</p>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Profile Information */}
        <div className="profile-section">
          <h3>Profile Information</h3>
          
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <label>Role:</label>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
              <div className="info-row">
                <label>Account Status:</label>
                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              <div className="info-row">
                <label>Saved Articles:</label>
                <span>{user.savedArticles.length} articles</span>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="primary-button"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div className="profile-section">
          <h3>Change Password</h3>
          
          {!isChangingPassword ? (
            <div className="password-info">
              <p>Keep your account secure by using a strong password.</p>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="change-password-button"
              >
                🔐 Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="form-input"
                  required
                />
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={passwordData.newPassword.length >= 8 ? 'valid' : 'invalid'}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}>
                      One lowercase letter
                    </li>
                    <li className={/\d/.test(passwordData.newPassword) ? 'valid' : 'invalid'}>
                      One number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'valid' : 'invalid'}>
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
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="form-input"
                  required
                />
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="error-message">Passwords do not match</div>
                )}
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                  className="primary-button"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Actions */}
        <div className="profile-section">
          <h3>Account Actions</h3>
          <div className="account-actions">
            <button 
              onClick={() => setShowDeactivateModal(true)}
              className="warning-button"
              disabled={!user.isActive}
            >
              ⚠️ Deactivate Account
            </button>
            <button className="danger-button">
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Deactivate Account</h3>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to deactivate your account?</p>
              <p><strong>What happens when you deactivate:</strong></p>
              <ul>
                <li>Your account will be marked as inactive</li>
                <li>You won't be able to log in</li>
                <li>Your saved articles will be preserved</li>
                <li>You can reactivate by contacting an administrator</li>
              </ul>
              
              <div className="form-group">
                <label htmlFor="deactivateReason">Reason for deactivation (optional):</label>
                <textarea
                  id="deactivateReason"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  className="form-input"
                  placeholder="Please let us know why you're deactivating your account..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={isLoading}
                className="warning-button"
              >
                {isLoading ? 'Deactivating...' : 'Deactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 