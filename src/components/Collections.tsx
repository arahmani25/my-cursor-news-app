import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Collection, Bookmark } from '../types/collections';
import { Article } from '../types';
import CollectionManager from './CollectionManager';

const Collections: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration - in a real app, this would come from a database
  const [collections, setCollections] = React.useState<Collection[]>([
    {
      id: 'reading-list',
      name: 'Reading List',
      description: 'Articles to read later',
      color: '#667eea',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleCount: 3
    },
    {
      id: 'favorites',
      name: 'Favorites',
      description: 'Your favorite articles',
      color: '#ff6b6b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleCount: 5
    },
    {
      id: 'tech-news',
      name: 'Tech News',
      description: 'Technology and innovation articles',
      color: '#4ecdc4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleCount: 2
    }
  ]);

  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([
    {
      id: 'bookmark-1',
      articleId: 'https://example.com/article1',
      collectionId: 'reading-list',
      addedAt: new Date().toISOString(),
      note: 'Interesting read about AI'
    },
    {
      id: 'bookmark-2',
      articleId: 'https://example.com/article2',
      collectionId: 'favorites',
      addedAt: new Date().toISOString()
    }
  ]);

  const [articles] = React.useState<Article[]>([
    {
      url: 'https://example.com/article1',
      title: 'The Future of Artificial Intelligence',
      description: 'How AI is transforming industries and our daily lives...',
      urlToImage: 'https://via.placeholder.com/300x200',
      publishedAt: new Date().toISOString(),
      source: { id: 'tech-news', name: 'Tech News' },
      author: 'John Smith',
      content: 'This article explores the latest developments in artificial intelligence and how they are reshaping various industries...'
    },
    {
      url: 'https://example.com/article2',
      title: 'Climate Change Solutions',
      description: 'Innovative approaches to combat climate change...',
      urlToImage: 'https://via.placeholder.com/300x200',
      publishedAt: new Date().toISOString(),
      source: { id: 'science-daily', name: 'Science Daily' },
      author: 'Jane Doe',
      content: 'Scientists are developing new technologies and strategies to address the global climate crisis...'
    }
  ]);

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

  if (!user) {
    return (
      <div className="container">
        <div className="auth-message">
          <h2>Please log in to access your collections</h2>
          <p>Create and manage your article collections to organize your reading.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Collections</h1>
        <p>Organize and manage your saved articles</p>
      </div>
      
      <CollectionManager
        collections={collections}
        bookmarks={bookmarks}
        articles={articles}
        onCreateCollection={handleCreateCollection}
        onUpdateCollection={handleUpdateCollection}
        onDeleteCollection={handleDeleteCollection}
        onAddBookmark={handleAddBookmark}
        onRemoveBookmark={handleRemoveBookmark}
        onUpdateBookmark={handleUpdateBookmark}
      />
    </div>
  );
};

export default Collections; 