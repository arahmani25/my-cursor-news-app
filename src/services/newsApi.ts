import axios from 'axios';
import { NewsApiResponse, Article } from '../types';
import { SearchFilters } from '../types/search';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '223fe5e8f44845d5bb0250dd3f548979'; // Use environment variable or fallback
const BASE_URL = 'https://newsapi.org/v2';

const newsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const searchNews = async (query: string, page: number = 1, filters?: SearchFilters): Promise<NewsApiResponse> => {
  try {
    // Check if API key is available
    if (!API_KEY || API_KEY === '223fe5e8f44845d5bb0250dd3f548979') {
      console.warn('Using fallback API key. Please set REACT_APP_NEWS_API_KEY environment variable.');
    }
    
    const params: any = {
      q: query,
      page,
      pageSize: filters?.pageSize || 20,
      sortBy: filters?.sortBy || 'publishedAt',
      language: filters?.language || 'en',
    };

    // Add date filters if provided
    if (filters?.dateFrom) {
      params.from = filters.dateFrom;
    }
    if (filters?.dateTo) {
      params.to = filters.dateTo;
    }

    const response = await newsApi.get('/everything', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching news:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your REACT_APP_NEWS_API_KEY environment variable.');
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error('Failed to fetch news articles. Please try again later.');
  }
};

export const getTopHeadlines = async (): Promise<NewsApiResponse> => {
  try {
    // Check if API key is available
    if (!API_KEY || API_KEY === '223fe5e8f44845d5bb0250dd3f548979') {
      console.warn('Using fallback API key. Please set REACT_APP_NEWS_API_KEY environment variable.');
    }
    
    const response = await newsApi.get('/top-headlines', {
      params: {
        country: 'us',
        pageSize: 20,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching top headlines:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your REACT_APP_NEWS_API_KEY environment variable.');
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error('Failed to fetch top headlines. Please try again later.');
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}; 