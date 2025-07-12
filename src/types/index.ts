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

export interface User {
  id: string;
  email: string;
  name: string;
  savedArticles: Article[];
  role?: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
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
  loading: boolean;
}

export interface SearchParams {
  query: string;
  page: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} 