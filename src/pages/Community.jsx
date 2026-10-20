import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  SlidersHorizontal, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  X, 
  Briefcase
} from 'lucide-react';
import { 
  selectFilteredPosts, 
  selectFilters, 
  selectSort, 
  selectSearchQuery, 
  setFilter, 
  clearFilters, 
  setSort, 
  setSearchQuery,
  selectAllPosts
} from '../store/communitySlice';
import { PILOT_CITY_NAMES } from '../data/destinations';
import { CATEGORIES, TRAVELER_TYPES, BUDGET_LEVELS } from '../data/posts';
import { useAuth } from '../context/AuthContext';

import Button from '../components/common/Button';
import Pill from '../components/common/Pill';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import PostCard from '../components/community/PostCard';
import CreatePostModal from '../components/community/CreatePostModal';
import GuideServiceModal from '../components/community/GuideServiceModal';

import './Community.css';

export default function Community() {
  const dispatch = useDispatch();
  const { userRole } = useAuth();

  const allPosts = useSelector(selectAllPosts);
  const filteredPosts = useSelector(selectFilteredPosts);
  const filters = useSelector(selectFilters);
  const sort = useSelector(selectSort);
  const searchQuery = useSelector(selectSearchQuery);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  // Initial skeleton load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Compute trending places from real posts
  const trendingPlaces = useMemo(() => {
    const counts = {};
    allPosts.forEach((p) => {
      if (p.placeName) {
        counts[p.placeName] = (counts[p.placeName] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([place, count]) => ({ place, count }));
  }, [allPosts]);

  // Top contributors list
  const topContributors = useMemo(() => {
    const map = {};
    allPosts.forEach((p) => {
      if (p.author) {
        if (!map[p.author.name]) {
          map[p.author.name] = {
            name: p.author.name,
            badge: p.author.badge,
            isGuide: p.author.isGuide,
            postsCount: 0,
            helpfulTotal: 0
          };
        }
        map[p.author.name].postsCount += 1;
        map[p.author.name].helpfulTotal += p.helpfulCount || 0;
      }
    });
    return Object.values(map)
      .sort((a, b) => b.helpfulTotal - a.helpfulTotal)
      .slice(0, 4);
  }, [allPosts]);

  // Handle multi-select filters
  const toggleMultiFilter = (key, val) => {
    const current = filters[key] || [];
    const updated = current.includes(val)
      ? current.filter((item) => item !== val)
      : [...current, val];
    dispatch(setFilter({ key, value: updated }));
  };

  const handleClearAll = () => {
    dispatch(clearFilters());
    setLocalSearch('');
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setCreateModalOpen(true);
  };

  const activeChips = useMemo(() => {
    const chips = [];
    filters.cities.forEach((c) =>
      chips.push({ label: `City: ${c}`, onRemove: () => toggleMultiFilter('cities', c) })
    );
    filters.categories.forEach((cat) =>
      chips.push({ label: `Category: ${cat}`, onRemove: () => toggleMultiFilter('categories', cat) })
    );
    filters.travelerTypes.forEach((t) =>
      chips.push({ label: `Type: ${t}`, onRemove: () => toggleMultiFilter('travelerTypes', t) })
    );
    filters.budgetLevels.forEach((b) =>
      chips.push({ label: `Budget: ${b}`, onRemove: () => toggleMultiFilter('budgetLevels', b) })
    );
    if (filters.minRating > 0) {
      chips.push({
        label: `Rating: ${filters.minRating}+ stars`,
        onRemove: () => dispatch(setFilter({ key: 'minRating', value: 0 }))
      });
    }
    if (filters.visitedLast12Months) {
      chips.push({
        label: 'Visited in last 12 months',
        onRemove: () => dispatch(setFilter({ key: 'visitedLast12Months', value: false }))
      });
    }
    if (searchQuery) {
      chips.push({
        label: `Search: "${searchQuery}"`,
        onRemove: () => {
          dispatch(setSearchQuery(''));
          setLocalSearch('');
        }
      });
    }
    return chips;
  }, [filters, searchQuery, dispatch]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <main id="main-content" className="community-page">
      {/* Community Header Banner */}
      <section className="community-hero-band">
        <div className="container">
          <div className="community-hero-content">
            <div className="community-hero-text">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>FIELD NOTES FORUM</span>
              </div>
              <h1 className="community-title">Field Notes</h1>
              <p className="community-subtitle">
                What people who've actually been there say. Specific queue times, verified prices in ₹, and real transit tips across our verified destinations.
              </p>
            </div>

            <div className="community-hero-actions">
              {userRole === 'guide' && (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Briefcase size={16} />}
                  onClick={() => setGuideModalOpen(true)}
                >
                  Offer a service
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => {
                  setEditingPost(null);
                  setCreateModalOpen(true);
                }}
              >
                Share your trip
              </Button>
            </div>
          </div>

          {/* Search Bar with Debounce */}
          <div className="community-search-bar">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              className="search-input"
              placeholder="Search by city, place name, queue advice, or keyword (e.g. 'Amer Fort', 'Luggage', 'Monkeys')..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="Search field notes"
            />
            {localSearch && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setLocalSearch('');
                  dispatch(setSearchQuery(''));
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            {/* Mobile Filter Sheet Toggle */}
            <button
              type="button"
              className="mobile-filter-trigger"
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Open filter options"
            >
              <SlidersHorizontal size={16} />
              <span>Filters ({activeChips.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main 3-Column Content Layout */}
      <div className="container community-main-layout">
        {/* =========================================================================
            COLUMN 1: LEFT FILTERS (Desktop/Tablet sidebar, Mobile bottom sheet)
            ========================================================================= */}
        <aside className={`community-sidebar community-sidebar--filters ${mobileFilterOpen ? 'is-mobile-open' : ''}`}>
          <div className="filter-panel">
            <div className="filter-panel-header">
              <span className="filter-panel-title">
                <SlidersHorizontal size={16} />
                <span>FILTERS</span>
              </span>
              <button
                type="button"
                className="filter-clear-all"
                onClick={handleClearAll}
                disabled={activeChips.length === 0}
              >
                Clear all
              </button>
              {mobileFilterOpen && (
                <button
                  type="button"
                  className="mobile-filter-close"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter 1: Pilot Cities */}
            <div className="filter-group">
              <label className="filter-group-label">DESTINATION</label>
              <div className="filter-checkbox-list">
                {PILOT_CITY_NAMES.map((cityName) => {
                  const checked = filters.cities.includes(cityName);
                  return (
                    <label key={cityName} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiFilter('cities', cityName)}
                      />
                      <span className="checkbox-custom" />
                      <span className="filter-item-text">{cityName}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Categories */}
            <div className="filter-group">
              <label className="filter-group-label">CATEGORY</label>
              <div className="filter-checkbox-list">
                {CATEGORIES.map((cat) => {
                  const checked = filters.categories.includes(cat);
                  return (
                    <label key={cat} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiFilter('categories', cat)}
                      />
                      <span className="checkbox-custom" />
                      <span className="filter-item-text">{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Traveler Type */}
            <div className="filter-group">
              <label className="filter-group-label">TRAVELER TYPE</label>
              <div className="filter-checkbox-list">
                {TRAVELER_TYPES.map((type) => {
                  const checked = filters.travelerTypes.includes(type);
                  return (
                    <label key={type} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiFilter('travelerTypes', type)}
                      />
                      <span className="checkbox-custom" />
                      <span className="filter-item-text">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter 4: Budget Level */}
            <div className="filter-group">
              <label className="filter-group-label">BUDGET LEVEL</label>
              <div className="filter-pills-row">
                {BUDGET_LEVELS.map((level) => {
                  const selected = filters.budgetLevels.includes(level);
                  return (
                    <button
                      key={level}
                      type="button"
                      className={`budget-filter-pill ${selected ? 'is-selected' : ''}`}
                      onClick={() => toggleMultiFilter('budgetLevels', level)}
                    >
                      {level} {level === '₹' ? 'Budget' : level === '₹₹' ? 'Mid' : 'Premium'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 5: Minimum Rating */}
            <div className="filter-group">
              <label className="filter-group-label">MINIMUM RATING</label>
              <div className="rating-filter-options">
                {[0, 3, 4, 4.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    className={`rate-filter-btn ${filters.minRating === rate ? 'is-selected' : ''}`}
                    onClick={() => dispatch(setFilter({ key: 'minRating', value: rate }))}
                  >
                    {rate === 0 ? 'Any' : `${rate}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 6: Visited in last 12 months toggle */}
            <div className="filter-group">
              <label className="filter-toggle-item">
                <input
                  type="checkbox"
                  checked={filters.visitedLast12Months}
                  onChange={(e) =>
                    dispatch(setFilter({ key: 'visitedLast12Months', value: e.target.checked }))
                  }
                />
                <span className="toggle-switch" />
                <span className="filter-item-text">Visited in last 12 months</span>
              </label>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            COLUMN 2: CENTER FEED
            ========================================================================= */}
        <section className="community-feed-col" aria-label="Field Notes Feed">
          {/* Active Chips & Sort Row */}
          <div className="feed-controls-bar">
            <div className="feed-count-summary">
              <strong>Showing {filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'note' : 'notes'}
              {allPosts.length > 0 && <small className="feed-total-count"> (of {allPosts.length} total)</small>}
            </div>

            {/* Sort Dropdown */}
            <div className="feed-sort-wrap">
              <label htmlFor="feed-sort-select" className="sort-label">Sort by:</label>
              <select
                id="feed-sort-select"
                className="sort-select"
                value={sort}
                onChange={(e) => dispatch(setSort(e.target.value))}
              >
                <option value="helpful">Most helpful</option>
                <option value="newest">Newest first</option>
                <option value="topRated">Top rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="active-chips-strip">
              {activeChips.map((chip, idx) => (
                <Pill key={idx} variant="accent" onRemove={chip.onRemove}>
                  {chip.label}
                </Pill>
              ))}
              <button type="button" className="clear-all-text-btn" onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          )}

          {/* Feed Content */}
          {loading ? (
            <div className="feed-skeletons">
              <Skeleton variant="card" count={3} />
            </div>
          ) : displayedPosts.length > 0 ? (
            <div className="feed-posts-list">
              {displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  searchQuery={searchQuery}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="feed-load-more">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                  >
                    Load {Math.min(8, filteredPosts.length - visibleCount)} more notes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? `No notes matching "${searchQuery}"` : "No notes for this filter yet"}
              description="Be the first to share a specific logistical review, queue time, or pricing note."
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleClearAll}
                  leftIcon={<RotateCcw size={15} />}
                >
                  Clear all filters
                </Button>
              }
            />
          )}
        </section>

        {/* =========================================================================
            COLUMN 3: RIGHT SIDEBAR (Top contributors, trending places, guidelines)
            ========================================================================= */}
        <aside className="community-sidebar community-sidebar--right">
          {/* Trending Places */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <TrendingUp size={16} className="sidebar-header-icon" />
              <h3 className="sidebar-card-title">Trending Places</h3>
            </div>
            <ul className="trending-list">
              {trendingPlaces.map((item, idx) => (
                <li
                  key={item.place}
                  className="trending-item"
                  onClick={() => dispatch(setSearchQuery(item.place))}
                >
                  <span className="trending-rank">#{idx + 1}</span>
                  <div className="trending-info">
                    <strong className="trending-place-name">{item.place}</strong>
                    <small>{item.count} field {item.count === 1 ? 'note' : 'notes'}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Contributors */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <Award size={16} className="sidebar-header-icon" />
              <h3 className="sidebar-card-title">Top Contributors</h3>
            </div>
            <div className="contributors-list">
              {topContributors.map((c) => (
                <div key={c.name} className="contributor-item">
                  <div className="contributor-details">
                    <strong className="contributor-name">{c.name}</strong>
                    <div className="contributor-meta">
                      {c.isGuide ? (
                        <span className="contributor-guide-tag">Local Guide</span>
                      ) : (
                        <span className="contributor-tag">Verified Visitor</span>
                      )}
                      <span>&bull;</span>
                      <small>{c.helpfulTotal} helpful votes</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="sidebar-card sidebar-card--guidelines">
            <div className="sidebar-card-header">
              <ShieldCheck size={16} className="sidebar-header-icon" />
              <h3 className="sidebar-card-title">Field Note Rules</h3>
            </div>
            <ul className="guidelines-list">
              <li><strong>Be specific:</strong> Mention exact gate names, bus numbers, and costs in ₹.</li>
              <li><strong>No generic clichés:</strong> Explain logistics rather than "unforgettable vibes".</li>
              <li><strong>Honest negatives welcome:</strong> If an attraction had a 3-hour queue or poor maintenance, note it clearly.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Create / Edit Post Modal */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingPost(null);
        }}
        editTarget={editingPost}
      />

      {/* Local Guide Service Modal */}
      <GuideServiceModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </main>
  );
}
