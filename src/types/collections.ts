import { Article } from './index';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  articleCount: number;
}

export interface Bookmark {
  id: string;
  articleId: string;
  collectionId?: string;
  addedAt: string;
  note?: string;
}

export interface ArticleWithBookmark {
  article: Article;
  bookmark?: Bookmark;
  collection?: Collection;
}

export interface CollectionStats {
  totalCollections: number;
  totalBookmarks: number;
  mostUsedCollection?: Collection;
  recentBookmarks: number;
}

export const defaultCollections: Collection[] = [
  {
    id: 'reading-list',
    name: 'Reading List',
    description: 'Articles to read later',
    color: '#667eea',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleCount: 0
  },
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'Your favorite articles',
    color: '#ff6b6b',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleCount: 0
  },
  {
    id: 'tech-news',
    name: 'Tech News',
    description: 'Technology and innovation articles',
    color: '#4ecdc4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleCount: 0
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business and finance articles',
    color: '#45b7d1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleCount: 0
  }
];

export const collectionColors = [
  '#667eea', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3',
  '#ff9f43', '#10ac84', '#ee5253', '#0abde3', '#48dbfb'
]; 