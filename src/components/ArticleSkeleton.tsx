import React from 'react';

const ArticleSkeleton: React.FC = () => {
  return (
    <div className="article-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="article-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-description short"></div>
        <div className="skeleton-meta">
          <div className="skeleton-meta-item"></div>
          <div className="skeleton-meta-item"></div>
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-button"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton; 