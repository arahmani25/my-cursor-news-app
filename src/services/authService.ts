import { User } from '../types';

// Mock database for users (in a real app, this would be a backend API)
interface StoredUser extends User {
  password: string;
}

// Initialize with some default users
const users: StoredUser[] = [
  {
    id: '1',
    email: 'admin@newsapp.com',
    name: 'Admin User',
    password: 'Admin123!', // In real app, this would be hashed
    role: 'admin',
    isActive: true,
    savedArticles: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@newsapp.com',
    name: 'Test User',
    password: 'User123!', // In real app, this would be hashed
    role: 'user',
    isActive: true,
    savedArticles: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Load users from localStorage on startup
const loadUsers = (): StoredUser[] => {
  const stored = localStorage.getItem('users');
  if (stored) {
    return JSON.parse(stored);
  }
  // Save default users
  localStorage.setItem('users', JSON.stringify(users));
  return users;
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Get all users (for admin)
export const getAllUsers = (): StoredUser[] => {
  return loadUsers();
};

// Register new user
export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  const currentUsers = loadUsers();
  
  // Check if email already exists
  if (currentUsers.find(user => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }

  // Validate password strength
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors.join(', '));
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    password, // In real app, this would be hashed
    role: 'user',
    isActive: true,
    savedArticles: [],
    createdAt: new Date().toISOString()
  };

  currentUsers.push(newUser);
  saveUsers(currentUsers);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  const currentUsers = loadUsers();
  
  const user = currentUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated. Please contact administrator.');
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  saveUsers(currentUsers);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Reset password
export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  const currentUsers = loadUsers();
  
  const user = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('User not found');
  }

  // Validate new password
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors.join(', '));
  }

  user.password = newPassword; // In real app, this would be hashed
  saveUsers(currentUsers);
};

// Check if email exists (for forgot password)
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const currentUsers = loadUsers();
  return currentUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Admin functions
export const updateUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
  const currentUsers = loadUsers();
  const user = currentUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  user.isActive = isActive;
  saveUsers(currentUsers);
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  const currentUsers = loadUsers();
  const user = currentUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  user.role = role;
  saveUsers(currentUsers);
};

export const deleteUser = async (userId: string): Promise<void> => {
  const currentUsers = loadUsers();
  const filteredUsers = currentUsers.filter(u => u.id !== userId);
  
  if (filteredUsers.length === currentUsers.length) {
    throw new Error('User not found');
  }

  saveUsers(filteredUsers);
};

// Update user profile
export const updateUserProfile = async (userId: string, name: string, email: string): Promise<User> => {
  const currentUsers = loadUsers();
  const user = currentUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Check if email is already taken by another user
  const emailExists = currentUsers.find(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    throw new Error('Email is already taken by another user');
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Update user data
  user.name = name;
  user.email = email.toLowerCase();
  
  saveUsers(currentUsers);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Change user password
export const changeUserPassword = async (email: string, currentPassword: string, newPassword: string): Promise<void> => {
  const currentUsers = loadUsers();
  const user = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }

  // Validate new password
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors.join(', '));
  }

  // Update password
  user.password = newPassword; // In real app, this would be hashed
  saveUsers(currentUsers);
};

// Validation functions
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  const currentUsers = loadUsers();
  const user = currentUsers.find(u => u.id === userId);
  
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}; 