import React, { useState } from 'react';
import { Article } from '../types';
import { Collection, Bookmark } from '../types/collections';

interface BookmarkButtonProps {
  article: Article;
  collections: Collection[];
  bookmarks: Bookmark[];
  onAddBookmark: (articleId: string, collectionId?: string, note?: string) => void;
  onRemoveBookmark: (articleId: string) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  article,
  collections,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [note, setNote] = useState('');

  const existingBookmark = bookmarks.find(b => b.articleId === article.url);
  const isBookmarked = !!existingBookmark;

  const handleBookmark = () => {
    if (isBookmarked) {
      onRemoveBookmark(article.url);
    } else {
      onAddBookmark(article.url, selectedCollection || undefined, note || undefined);
      setSelectedCollection('');
      setNote('');
    }
    setShowDropdown(false);
  };

  const handleQuickBookmark = (collectionId: string) => {
    onAddBookmark(article.url, collectionId);
    setShowDropdown(false);
  };

  const getCollectionById = (id: string) => {
    return collections.find(c => c.id === id);
  };

  const currentCollection = existingBookmark?.collectionId 
    ? getCollectionById(existingBookmark.collectionId)
    : null;

  return (
    <div className="bookmark-button-container">
      <button
        className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        title={isBookmarked ? 'Remove bookmark' : 'Add to collection'}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill={isBookmarked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {isBookmarked && currentCollection && (
          <span 
            className="collection-indicator"
            style={{ backgroundColor: currentCollection.color }}
            title={currentCollection.name}
          />
        )}
      </button>

      {showDropdown && (
        <div className="bookmark-dropdown">
          {isBookmarked ? (
            <div className="bookmark-remove">
              <p>Remove from collection?</p>
              <div className="dropdown-actions">
                <button 
                  onClick={handleBookmark}
                  className="danger-button"
                >
                  Remove Bookmark
                </button>
                <button 
                  onClick={() => setShowDropdown(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bookmark-add">
              <h4>Add to Collection</h4>
              
              <div className="quick-collections">
                <p>Quick add:</p>
                <div className="quick-buttons">
                  {collections.slice(0, 4).map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => handleQuickBookmark(collection.id)}
                      className="quick-bookmark-button"
                      style={{ borderColor: collection.color }}
                    >
                      <span 
                        className="color-dot"
                        style={{ backgroundColor: collection.color }}
                      />
                      {collection.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-bookmark">
                <p>Or choose collection:</p>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="collection-select"
                >
                  <option value="">Select collection...</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>

                <div className="note-input">
                  <label>Note (optional):</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a personal note..."
                    rows={3}
                    className="note-textarea"
                  />
                </div>

                <div className="dropdown-actions">
                  <button 
                    onClick={handleBookmark}
                    className="primary-button"
                    disabled={!selectedCollection}
                  >
                    Add to Collection
                  </button>
                  <button 
                    onClick={() => setShowDropdown(false)}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarkButton; 