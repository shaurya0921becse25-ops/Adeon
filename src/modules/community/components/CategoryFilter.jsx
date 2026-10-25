import { Bookmark } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

export default function CategoryFilter() {
  const { categories, activeCategory, showSavedOnly, savedCount, handleCategoryChange } = useCommunity();

  return (
    <div
      className="category-filter"
      role="tablist"
      aria-label="Filter posts by category"
    >
      {categories.map(cat => (
        <button
          key={cat.id}
          id={`category-${cat.id}`}
          className={`category-chip${activeCategory === cat.id && !showSavedOnly ? ' active' : ''}`}
          role="tab"
          aria-selected={activeCategory === cat.id && !showSavedOnly}
          onClick={() => handleCategoryChange(cat.id)}
        >
          <span aria-hidden="true">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}

      {/* Saved filter chip */}
      <button
        id="category-saved"
        className={`category-chip saved-chip${showSavedOnly ? ' active' : ''}`}
        role="tab"
        aria-selected={showSavedOnly}
        onClick={() => handleCategoryChange('saved')}
        aria-label={`View ${savedCount} saved posts`}
      >
        <Bookmark size={13} />
        Saved {savedCount > 0 && `(${savedCount})`}
      </button>
    </div>
  );
}
