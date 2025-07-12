import React from 'react';
import { Category } from '../utils/categories';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  isLoading?: boolean;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  isLoading = false
}) => {
  return (
    <div className="category-tabs-container">
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category)}
            className={`category-tab ${activeCategory.id === category.id ? 'active' : ''}`}
            disabled={isLoading}
            title={category.description}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs; 