import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Article } from '../types';
import { 
  loginUser, 
  registerUser, 
  resetPassword, 
  checkEmailExists,
  getUserById,
  updateUserProfile as updateProfile,
  changeUserPassword as changePasswordService
} from '../services/authService';
import { sendWelcomeEmail } from '../services/emailService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userData = await registerUser(email, password, name);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Send welcome email (non-blocking)
      try {
        await sendWelcomeEmail(email, name);
        console.log('✅ Welcome email sent successfully');
      } catch (welcomeError) {
        console.warn('⚠️ Welcome email failed, but registration was successful:', welcomeError);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const saveArticle = (article: Article) => {
    if (user) {
      const updatedUser = {
        ...user,
        savedArticles: [...user.savedArticles, article],
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const unsaveArticle = (articleUrl: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        savedArticles: user.savedArticles.filter(
          (article: Article) => article.url !== articleUrl
        ),
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        throw new Error('Email not found in our system');
      }
      // In a real app, this would send an email
      return true;
    } catch (error) {
      throw error;
    }
  };

  const resetUserPassword = async (email: string, newPassword: string) => {
    try {
      await resetPassword(email, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (name: string, email: string) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      const updatedUser = await updateProfile(user.id, name, email);
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      await changePasswordService(user.email, currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const deactivateAccount = async (reason: string) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      // Update user status to inactive
      const updatedUser = {
        ...user,
        isActive: false
      };
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // In a real app, you would also save this to the backend
      // and log the deactivation reason
      console.log('Account deactivated:', { userId: user.id, reason });
      
      // Logout after a short delay
      setTimeout(() => {
        logout();
      }, 1000);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    saveArticle,
    unsaveArticle,
    isAuthenticated,
    forgotPassword,
    resetUserPassword,
    updateUserProfile,
    changePassword,
    deactivateAccount,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 