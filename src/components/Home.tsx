import React, { useState, useEffect } from 'react';
import { searchNews, getTopHeadlines } from '../services/newsApi';
import { Article, PaginationInfo } from '../types';
import { categories, Category, getDefaultCategory } from '../utils/categories';
import { SearchFilters } from '../types/search';
import { Collection, Bookmark, defaultCollections } from '../types/collections';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import ArticleSkeleton from './ArticleSkeleton';
import Pagination from './Pagination';
import CategoryTabs from './CategoryTabs';
import AdvancedSearchFilters from './AdvancedSearchFilters';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [activeCategory, setActiveCategory] = useState<Category>(getDefaultCategory());
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [collections, setCollections] = useState<Collection[]>(defaultCollections);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadTopHeadlines();
  }, []);

  const loadTopHeadlines = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTopHeadlines();
      setArticles(response.articles);
    } catch (err) {
      setError('Failed to load top headlines');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await searchNews(searchQuery, 1, searchFilters);
      setArticles(response.articles);
      
      const totalPages = Math.ceil(response.totalResults / (searchFilters.pageSize || 20));
      setPagination({
        currentPage: 1,
        totalPages: Math.min(totalPages, 50), // NewsAPI limit
        totalResults: response.totalResults,
        hasNextPage: totalPages > 1,
        hasPrevPage: false
      });
    } catch (err) {
      setError('Failed to search for news articles');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchFilters({});
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      hasNextPage: false,
      hasPrevPage: false
    });
    loadTopHeadlines();
  };

  const handlePageChange = async (page: number) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchNews(searchQuery, page, searchFilters);
      setArticles(response.articles);
      setPagination((prev: PaginationInfo) => ({
        ...prev,
        currentPage: page,
        hasNextPage: page < prev.totalPages,
        hasPrevPage: page > 1
      }));
    } catch (err) {
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const nextPage = pagination.currentPage + 1;
      const response = await searchNews(searchQuery, nextPage, searchFilters);
      setArticles(prev => [...prev, ...response.articles]);
      setPagination((prev: PaginationInfo) => ({
        ...prev,
        currentPage: nextPage,
        hasNextPage: nextPage < prev.totalPages,
        hasPrevPage: true
      }));
    } catch (err) {
      setError('Failed to load more articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: Category) => {
    setActiveCategory(category);
    setLoading(true);
    setError('');
    setHasSearched(true);
    setSearchQuery(category.name);

    try {
      const response = await searchNews(category.query, 1, searchFilters);
      setArticles(response.articles);
      
      const totalPages = Math.ceil(response.totalResults / (searchFilters.pageSize || 20));
      setPagination({
        currentPage: 1,
        totalPages: Math.min(totalPages, 50),
        totalResults: response.totalResults,
        hasNextPage: totalPages > 1,
        hasPrevPage: false
      });
    } catch (err) {
      setError('Failed to load category articles');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleFiltersReset = () => {
    setSearchFilters({});
  };

  // Collection and Bookmark handlers
  const handleCreateCollection = (collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>) => {
    const newCollection: Collection = {
      ...collectionData,
      id: `collection-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleCount: 0
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const handleUpdateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(collection => 
      collection.id === id 
        ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
        : collection
    ));
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
    // Remove bookmarks from deleted collection
    setBookmarks(prev => prev.filter(bookmark => bookmark.collectionId !== id));
  };

  const handleAddBookmark = (articleId: string, collectionId?: string, note?: string) => {
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      articleId,
      collectionId,
      note,
      addedAt: new Date().toISOString()
    };
    setBookmarks(prev => [...prev, newBookmark]);
    
    // Update collection article count
    if (collectionId) {
      setCollections(prev => prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, articleCount: collection.articleCount + 1, updatedAt: new Date().toISOString() }
          : collection
      ));
    }
  };

  const handleRemoveBookmark = (articleId: string) => {
    const bookmarkToRemove = bookmarks.find(b => b.articleId === articleId);
    setBookmarks(prev => prev.filter(bookmark => bookmark.articleId !== articleId));
    
    // Update collection article count
    if (bookmarkToRemove?.collectionId) {
      setCollections(prev => prev.map(collection => 
        collection.id === bookmarkToRemove.collectionId 
          ? { ...collection, articleCount: Math.max(0, collection.articleCount - 1), updatedAt: new Date().toISOString() }
          : collection
      ));
    }
  };

  const handleUpdateBookmark = (articleId: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.articleId === articleId 
        ? { ...bookmark, ...updates }
        : bookmark
    ));
  };

  return (
    <div>
      <div className="search-container">
        <h1 className="search-title">
          {hasSearched ? 'Search Results' : 'Stay Updated with Latest News'}
        </h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        
        <AdvancedSearchFilters
          filters={searchFilters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
        
        {hasSearched && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleClearSearch}
              className="search-button"
              style={{ margin: '0 auto' }}
            >
              Back to Top Headlines
            </button>
          </div>
        )}
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        isLoading={loading}
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="articles-grid">
          {[...Array(6)].map((_, index) => (
            <ArticleSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article, index) => (
            <ArticleCard 
              key={`${article.url}-${index}`} 
              article={article}
              collections={collections}
              bookmarks={bookmarks}
              onAddBookmark={handleAddBookmark}
              onRemoveBookmark={handleRemoveBookmark}
            />
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <div className="loading">
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '20px', textAlign: 'center' }}>No articles found.</p>
        </div>
      )}

      {hasSearched && !loading && articles.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLoadMore={handleLoadMore}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default Home; 