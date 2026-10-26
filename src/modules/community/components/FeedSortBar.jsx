import { Flame, Sparkles, TrendingUp, MessageSquare, Bookmark, X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

export default function FeedSortBar() {
  const {
    sortMode,
    setSortMode,
    categories,
    activeCategory,
    showSavedOnly,
    savedCount,
    handleCategoryChange,
    activeTag,
    activeCity,
    searchQuery,
    clearFilters,
  } = useCommunity();

  const SORT_TABS = [
    { id: 'hot',       label: 'Hot',            icon: Flame },
    { id: 'new',       label: 'New',            icon: Sparkles },
    { id: 'top',       label: 'Top',            icon: TrendingUp },
    { id: 'discussed', label: 'Most Discussed', icon: MessageSquare },
  ];

  const hasActiveFilters = searchQuery.trim() || activeTag || activeCity || activeCategory !== 'all' || showSavedOnly;

  return (
    <div className="feed-controls" aria-label="Feed sorting and category filters">
      {/* Top Row: Reddit Sort Tabs */}
      <div className="feed-controls__sort-row">
        <div className="feed-sort-tabs" role="tablist" aria-label="Sort feed by">
          {SORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = sortMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`feed-sort-tab feed-sort-tab--${tab.id}${isActive ? ' active' : ''}`}
                onClick={() => setSortMode(tab.id)}
                role="tab"
                aria-selected={isActive}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Saved Posts Shortcut */}
        <button
          type="button"
          className={`feed-saved-shortcut${showSavedOnly ? ' active' : ''}`}
          onClick={() => handleCategoryChange('saved')}
          aria-label={`View ${savedCount} saved stories`}
        >
          <Bookmark size={15} fill={showSavedOnly ? 'currentColor' : 'none'} />
          <span>Saved</span>
          {savedCount > 0 && <span className="saved-badge">{savedCount}</span>}
        </button>
      </div>

      {/* Second Row: Category Flair Pills */}
      <div className="feed-controls__flairs" role="tablist" aria-label="Filter by travel topic">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id && !showSavedOnly && !activeTag && !activeCity;
          return (
            <button
              key={cat.id}
              type="button"
              className={`flair-pill${isActive ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              role="tab"
              aria-selected={isActive}
            >
              <span className="flair-emoji" aria-hidden="true">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Status Badge if filtering by Search, Tag, City, or Category */}
      {hasActiveFilters && (
        <div className="feed-controls__status-banner">
          <div className="feed-controls__status-text">
            {activeCity && (
              <span>City: <strong>📍 {activeCity}</strong></span>
            )}
            {searchQuery.trim() && (
              <span>Matching search: <strong>"{searchQuery}"</strong></span>
            )}
            {activeTag && (
              <span>Tagged with: <strong>#{activeTag}</strong></span>
            )}
            {showSavedOnly && (
              <span>Showing: <strong>Saved Stories</strong></span>
            )}
            {!searchQuery.trim() && !activeTag && !activeCity && !showSavedOnly && activeCategory !== 'all' && (
              <span>Category: <strong>{categories.find(c => c.id === activeCategory)?.label}</strong></span>
            )}
          </div>
          <button
            type="button"
            className="feed-controls__clear-btn"
            onClick={clearFilters}
            aria-label="Clear active filter"
          >
            <X size={14} /> Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
