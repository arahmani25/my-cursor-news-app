import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, updateUserStatus, updateUserRole, deleteUser } from '../services/authService';
import LoadingSpinner from './LoadingSpinner';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  savedArticlesCount: number;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const loadUsers = () => {
    try {
      const allUsers = getAllUsers();
      const adminUsers: AdminUser[] = allUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        savedArticlesCount: user.savedArticles?.length || 0
      }));
      setUsers(adminUsers);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      setSuccess(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole} successfully`);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setSuccess('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) {
      setError('Please select users first');
      return;
    }

    try {
      for (const userId of selectedUsers) {
        if (action === 'activate') {
          await updateUserStatus(userId, true);
        } else if (action === 'deactivate') {
          await updateUserStatus(userId, false);
        } else if (action === 'delete') {
          await deleteUser(userId);
        }
      }
      
      setSuccess(`Bulk ${action} completed successfully`);
      setSelectedUsers([]);
      loadUsers();
    } catch (err: any) {
      setError(err.message || `Failed to ${action} users`);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? '✅ Active' : '❌ Inactive'}
      </span>
    );
  };

  const getRoleBadge = (role: 'user' | 'admin') => {
    return (
      <span className={`role-badge ${role}`}>
        {role === 'admin' ? '👑 Admin' : '👤 User'}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Access Denied</h2>
            <p>You don't have permission to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Loading Users</h2>
            <p>Please wait while we load user data...</p>
          </div>
          <LoadingSpinner size="large" color="#667eea" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage users and system settings</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.isActive).length}</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'admin').length}</h3>
          <p>Administrators</p>
        </div>
        <div className="stat-card">
          <h3>{users.reduce((sum, u) => sum + u.savedArticlesCount, 0)}</h3>
          <p>Total Saved Articles</p>
        </div>
      </div>

      <div className="users-section">
        <div className="users-header">
          <h2>User Management</h2>
          
          {/* Search and Filters */}
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="user">Users Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.length} user(s) selected</span>
              <div className="bulk-buttons">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="bulk-button activate"
                >
                  ✅ Activate Selected
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="bulk-button deactivate"
                >
                  ❌ Deactivate Selected
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bulk-button delete"
                >
                  🗑️ Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="select-all-checkbox"
                  />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Saved Articles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="user-checkbox"
                    />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value as 'user' | 'admin')}
                      className="role-select"
                      disabled={user.id === '1'} // Prevent changing main admin role
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusToggle(user.id, user.isActive)}
                      className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                      disabled={user.id === '1'} // Prevent deactivating main admin
                    >
                      {getStatusBadge(user.isActive)}
                    </button>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                  <td>{user.savedArticlesCount}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="delete-button"
                        disabled={user.id === '1'} // Prevent deleting main admin
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="danger-button"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 