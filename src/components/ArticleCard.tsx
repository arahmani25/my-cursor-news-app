import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Article } from '../types';
import { Collection, Bookmark } from '../types/collections';
import { formatDate, truncateText } from '../services/newsApi';
import ShareButton from './ShareButton';
import BookmarkButton from './BookmarkButton';

interface ArticleCardProps {
  article: Article;
  collections?: Collection[];
  bookmarks?: Bookmark[];
  onAddBookmark?: (articleId: string, collectionId?: string, note?: string) => void;
  onRemoveBookmark?: (articleId: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  collections = [], 
  bookmarks = [], 
  onAddBookmark, 
  onRemoveBookmark 
}) => {
  const { isAuthenticated, saveArticle, unsaveArticle, user } = useAuth();

  const isSaved = user?.savedArticles.some(
    (savedArticle: any) => savedArticle.url === article.url
  );

  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveArticle(article.url);
    } else {
      saveArticle(article);
    }
  };

  const handleReadMore = () => {
    window.open(article.url, '_blank');
  };

  return (
    <div className="article-card">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="article-image"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        {article.description && (
          <p className="article-description">
            {truncateText(article.description, 150)}
          </p>
        )}
        <div className="article-meta">
          <span>{article.source.name}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <div className="article-actions">
          <button
            onClick={handleReadMore}
            className="action-button read-button"
          >
            Read More
          </button>
          {isAuthenticated && (
            <button
              onClick={handleSaveToggle}
              className={`action-button ${
                isSaved ? 'unsave-button' : 'save-button'
              }`}
            >
              {isSaved ? 'Unsave' : 'Save'}
            </button>
          )}
          {isAuthenticated && onAddBookmark && onRemoveBookmark && (
            <BookmarkButton
              article={article}
              collections={collections}
              bookmarks={bookmarks}
              onAddBookmark={onAddBookmark}
              onRemoveBookmark={onRemoveBookmark}
            />
          )}
          <ShareButton article={article} size="small" />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 