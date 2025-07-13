import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Article } from '../types';
import { 
  auth,
  registerUserWithFirebase,
  loginUserWithFirebase,
  getCurrentUser,
  updateUserProfileInFirebase,
  getAllUsersFromFirebase
} from '../services/firebase';
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
    // Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUserWithFirebase(email, password);
      // Firebase auth state change will handle the rest
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userData = await registerUserWithFirebase(email, password, name);
      
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
    auth.signOut();
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
      // Firebase will handle password reset
      // For now, just return true - you can implement Firebase password reset later
      return true;
    } catch (error) {
      throw error;
    }
  };

  const resetUserPassword = async (email: string, newPassword: string) => {
    try {
      // Firebase password reset would go here
      // For now, just throw an error
      throw new Error('Password reset not implemented yet');
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (name: string, email: string) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      const updatedUser = await updateUserProfileInFirebase(user.id, name, email);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      // Firebase password change would go here
      throw new Error('Password change not implemented yet');
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