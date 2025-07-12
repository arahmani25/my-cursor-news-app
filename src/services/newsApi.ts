import axios from 'axios';
import { NewsApiResponse, Article } from '../types';
import { SearchFilters } from '../types/search';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '223fe5e8f44845d5bb0250dd3f548979'; // Use environment variable or fallback

// Debug: Log the API key status (remove this in production)
console.log('API Key Status:', {
  hasEnvVar: !!process.env.REACT_APP_NEWS_API_KEY,
  isUsingFallback: !process.env.REACT_APP_NEWS_API_KEY,
  keyLength: API_KEY.length
});

const BASE_URL = 'https://newsapi.org/v2';

// Mock data for development/testing
const MOCK_ARTICLES = [
  {
    source: { id: '1', name: 'Mock News' },
    author: 'Test Author',
    title: 'Breaking News: Technology Advances',
    description: 'Latest developments in technology are changing the world.',
    url: 'https://example.com/article1',
    urlToImage: 'https://via.placeholder.com/300x200?text=News+1',
    publishedAt: new Date().toISOString(),
    content: 'This is a mock article for testing purposes.'
  },
  {
    source: { id: '2', name: 'Mock News' },
    author: 'Test Author 2',
    title: 'Science Discovery: New Breakthrough',
    description: 'Scientists discover new breakthrough in research.',
    url: 'https://example.com/article2',
    urlToImage: 'https://via.placeholder.com/300x200?text=News+2',
    publishedAt: new Date().toISOString(),
    content: 'This is another mock article for testing purposes.'
  },
  {
    source: { id: '3', name: 'Mock News' },
    author: 'Test Author 3',
    title: 'Business Update: Market Trends',
    description: 'Latest market trends and business insights.',
    url: 'https://example.com/article3',
    urlToImage: 'https://via.placeholder.com/300x200?text=News+3',
    publishedAt: new Date().toISOString(),
    content: 'This is a third mock article for testing purposes.'
  }
];

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
    
    // If there's a network/CORS error, return mock data
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.log('Using mock data due to network/CORS issues');
      return {
        status: 'ok',
        totalResults: MOCK_ARTICLES.length,
        articles: MOCK_ARTICLES.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
        )
      };
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your REACT_APP_NEWS_API_KEY environment variable.');
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    // For other errors, also return mock data
    console.log('Using mock data due to API error');
    return {
      status: 'ok',
      totalResults: MOCK_ARTICLES.length,
      articles: MOCK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      )
    };
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
    
    // If there's a network/CORS error, return mock data
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.log('Using mock data due to network/CORS issues');
      return {
        status: 'ok',
        totalResults: MOCK_ARTICLES.length,
        articles: MOCK_ARTICLES
      };
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your REACT_APP_NEWS_API_KEY environment variable.');
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    // For other errors, also return mock data
    console.log('Using mock data due to API error');
    return {
      status: 'ok',
      totalResults: MOCK_ARTICLES.length,
      articles: MOCK_ARTICLES
    };
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