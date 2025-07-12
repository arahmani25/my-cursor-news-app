// Core types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  savedArticles: Article[];
  createdAt: string;
  lastLogin?: string;
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  saveArticle: (article: Article) => void;
  unsaveArticle: (articleUrl: string) => void;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<boolean>;
  resetUserPassword: (email: string, newPassword: string) => Promise<void>;
  updateUserProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deactivateAccount: (reason: string) => Promise<void>;
  loading: boolean;
} 