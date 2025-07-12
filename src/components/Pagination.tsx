import React from 'react';
import { PaginationInfo } from '../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLoadMore,
  isLoading = false
}) => {
  const { currentPage, totalPages, totalResults, hasNextPage, hasPrevPage } = pagination;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
          disabled={isLoading}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Showing page {currentPage} of {totalPages} 
          ({totalResults.toLocaleString()} total results)
        </span>
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-button"
          disabled={!hasPrevPage || isLoading}
        >
          ← Previous
        </button>
        
        {totalPages <= 10 ? (
          <div className="page-numbers">
            {renderPageNumbers()}
          </div>
        ) : (
          <div className="page-numbers">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="pagination-button"
                  disabled={isLoading}
                >
                  1
                </button>
                {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
              </>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="pagination-button"
                  disabled={isLoading}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-button"
          disabled={!hasNextPage || isLoading}
        >
          Next →
        </button>
      </div>
      
      {hasNextPage && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            className="load-more-button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Articles'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination; 