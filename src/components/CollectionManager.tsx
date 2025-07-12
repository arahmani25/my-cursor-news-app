import React, { useState } from 'react';
import { Collection, Bookmark, ArticleWithBookmark, collectionColors } from '../types/collections';
import { Article } from '../types';

interface CollectionManagerProps {
  collections: Collection[];
  bookmarks: Bookmark[];
  articles: Article[];
  onCreateCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>) => void;
  onUpdateCollection: (id: string, updates: Partial<Collection>) => void;
  onDeleteCollection: (id: string) => void;
  onAddBookmark: (articleId: string, collectionId?: string, note?: string) => void;
  onRemoveBookmark: (articleId: string) => void;
  onUpdateBookmark: (articleId: string, updates: Partial<Bookmark>) => void;
}

const CollectionManager: React.FC<CollectionManagerProps> = ({
  collections,
  bookmarks,
  articles,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmark
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: collectionColors[0]
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    color: collectionColors[0]
  });

  const getArticleById = (articleId: string): Article | undefined => {
    return articles.find(article => article.url === articleId);
  };

  const getBookmarksWithArticles = (): ArticleWithBookmark[] => {
    return bookmarks.map(bookmark => {
      const article = getArticleById(bookmark.articleId);
      const collection = collections.find(c => c.id === bookmark.collectionId);
      return {
        article: article!,
        bookmark,
        collection
      };
    }).filter(item => item.article);
  };

  const handleCreateCollection = () => {
    if (newCollection.name.trim()) {
      onCreateCollection(newCollection);
      setNewCollection({ name: '', description: '', color: collectionColors[0] });
      setShowCreateForm(false);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection.id);
    setEditForm({
      name: collection.name,
      description: collection.description || '',
      color: collection.color
    });
  };

  const handleSaveEdit = () => {
    if (editingCollection && editForm.name.trim()) {
      onUpdateCollection(editingCollection, editForm);
      setEditingCollection(null);
      setEditForm({ name: '', description: '', color: collectionColors[0] });
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setEditForm({ name: '', description: '', color: collectionColors[0] });
  };

  const getCollectionStats = () => {
    const totalBookmarks = bookmarks.length;
    const recentBookmarks = bookmarks.filter(b => {
      const bookmarkDate = new Date(b.addedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return bookmarkDate > weekAgo;
    }).length;

    const collectionStats = collections.map(collection => {
      const count = bookmarks.filter(b => b.collectionId === collection.id).length;
      return { ...collection, articleCount: count };
    });

    const mostUsed = collectionStats.length > 0 
      ? collectionStats.reduce((prev, current) => 
          prev.articleCount > current.articleCount ? prev : current
        )
      : undefined;

    return {
      totalCollections: collections.length,
      totalBookmarks,
      mostUsedCollection: mostUsed && mostUsed.articleCount > 0 ? mostUsed : undefined,
      recentBookmarks
    };
  };

  const stats = getCollectionStats();
  const bookmarksWithArticles = getBookmarksWithArticles();

  return (
    <div className="collection-manager">
      <div className="collection-stats">
        <div className="stat-card">
          <h3>{stats.totalCollections}</h3>
          <p>Collections</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalBookmarks}</h3>
          <p>Bookmarks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.recentBookmarks}</h3>
          <p>This Week</p>
        </div>
      </div>

      <div className="collections-section">
        <div className="section-header">
          <h2>Your Collections</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="create-collection-button"
          >
            + New Collection
          </button>
        </div>

        {showCreateForm && (
          <div className="create-collection-form">
            <h3>Create New Collection</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newCollection.name}
                onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Collection name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newCollection.description}
                onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                className="form-input"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <div className="color-picker">
                {collectionColors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${newCollection.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCollection(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleCreateCollection} className="primary-button">
                Create Collection
              </button>
              <button onClick={() => setShowCreateForm(false)} className="secondary-button">
                Cancel
              </button>
            </div>
          </div>
        )}

        {editingCollection && (
          <div className="create-collection-form">
            <h3>Edit Collection</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Collection name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                className="form-input"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <div className="color-picker">
                {collectionColors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${editForm.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditForm(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleSaveEdit} className="primary-button">
                Save Changes
              </button>
              <button onClick={handleCancelEdit} className="secondary-button">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="collections-grid">
          {collections.map(collection => {
            const collectionBookmarks = bookmarks.filter(b => b.collectionId === collection.id);
            const collectionArticles = collectionBookmarks.map(bookmark => 
              getArticleById(bookmark.articleId)
            ).filter(Boolean);

            return (
              <div key={collection.id} className="collection-card">
                <div className="collection-header">
                  <div 
                    className="collection-color" 
                    style={{ backgroundColor: collection.color }}
                  />
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <p>{collection.description}</p>
                    <span className="article-count">
                      {collectionArticles.length} articles
                    </span>
                  </div>
                  <div className="collection-actions">
                    <button 
                      className="action-button"
                      onClick={() => handleEditCollection(collection)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button danger"
                      onClick={() => onDeleteCollection(collection.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {collectionArticles.length > 0 && (
                  <div className="collection-preview">
                    {collectionArticles.slice(0, 3).map(article => {
                      if (!article) return null;
                      return (
                        <div key={article.url} className="preview-item">
                          <h4>{article.title}</h4>
                          <p>{article.description?.substring(0, 100)}...</p>
                        </div>
                      );
                    })}
                    {collectionArticles.length > 3 && (
                      <p className="more-articles">
                        +{collectionArticles.length - 3} more articles
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bookmarks-section">
        <h2>Recent Bookmarks</h2>
        <div className="bookmarks-list">
          {bookmarksWithArticles.slice(0, 10).map(({ article, bookmark, collection }) => {
            if (!bookmark) return null;
            return (
              <div key={bookmark.id} className="bookmark-item">
                <div className="bookmark-content">
                  <h4>{article.title}</h4>
                  <p>{article.description?.substring(0, 150)}...</p>
                  <div className="bookmark-meta">
                    <span className="bookmark-date">
                      {new Date(bookmark.addedAt).toLocaleDateString()}
                    </span>
                    {collection && (
                      <span 
                        className="collection-tag"
                        style={{ backgroundColor: collection.color }}
                      >
                        {collection.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bookmark-actions">
                  <button 
                    className="action-button"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    Read
                  </button>
                  <button 
                    className="action-button danger"
                    onClick={() => onRemoveBookmark(bookmark.articleId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollectionManager; 