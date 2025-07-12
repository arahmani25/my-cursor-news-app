import React, { useState } from 'react';
import { SearchFilters, sortOptions, languageOptions, pageSizeOptions } from '../types/search';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isOpen,
  onToggle
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {};
    setLocalFilters(resetFilters);
    onReset();
  };

  return (
    <div className="advanced-filters-container">
      <button
        onClick={onToggle}
        className="filters-toggle-button"
        type="button"
      >
        🔍 Advanced Filters {isOpen ? '▼' : '▶'}
      </button>

      {isOpen && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Date Range */}
            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="filter-input"
                  placeholder="From date"
                />
                <input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="filter-input"
                  placeholder="To date"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={localFilters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="filter-group">
              <label className="filter-label">Language</label>
              <select
                value={localFilters.language || 'en'}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="filter-select"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size */}
            <div className="filter-group">
              <label className="filter-label">Results per page</label>
              <select
                value={localFilters.pageSize || 20}
                onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
                className="filter-select"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button
              onClick={handleApply}
              className="apply-filters-button"
              type="button"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="reset-filters-button"
              type="button"
            >
              Reset All
            </button>
          </div>

          {/* Active Filters Display */}
          {Object.keys(localFilters).length > 0 && (
            <div className="active-filters">
              <h4>Active Filters:</h4>
              <div className="active-filters-list">
                {localFilters.dateFrom && (
                  <span className="active-filter-tag">
                    From: {new Date(localFilters.dateFrom).toLocaleDateString()}
                  </span>
                )}
                {localFilters.dateTo && (
                  <span className="active-filter-tag">
                    To: {new Date(localFilters.dateTo).toLocaleDateString()}
                  </span>
                )}
                {localFilters.sortBy && (
                  <span className="active-filter-tag">
                    Sort: {sortOptions.find(s => s.value === localFilters.sortBy)?.label}
                  </span>
                )}
                {localFilters.language && (
                  <span className="active-filter-tag">
                    Language: {languageOptions.find(l => l.value === localFilters.language)?.label}
                  </span>
                )}
                {localFilters.pageSize && (
                  <span className="active-filter-tag">
                    Page Size: {localFilters.pageSize}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters; 