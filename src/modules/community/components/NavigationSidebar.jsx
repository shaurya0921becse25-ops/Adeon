import { useState } from 'react';
import {
  MapPin,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  X,
  HeartHandshake,
  Shield,
  UserPlus,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { POPULAR_CITIES, CATEGORIES, TOP_CONTRIBUTORS, COMMUNITY_RULES } from '../data/samplePosts.js';
import '../styles/community.css';

export default function NavigationSidebar() {
  const {
    allPostsCount,
    activeCity,
    handleSelectCity,
    activeCategory,
    handleCategoryChange,
    handleResetFilters,
    showSavedOnly,
    handleToggleFollow,
    followedUsers,
  } = useCommunity();

  const [showAllCities, setShowAllCities] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedRule, setExpandedRule] = useState(null);

  const displayedCities = showAllCities ? POPULAR_CITIES : POPULAR_CITIES.slice(0, 7);
  const isAllActive = activeCategory === 'all' && !activeCity && !showSavedOnly;

  // Active filter count for mobile badge
  const activeFiltersCount = (activeCategory !== 'all' ? 1 : 0) + (activeCity ? 1 : 0) + (showSavedOnly ? 1 : 0);

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <>
      {/* =========================================
          MOBILE COLLAPSIBLE TOGGLE BAR
          (Visible on small screens, hidden on desktop)
         ========================================= */}
      <div className="mobile-filter-bar">
        <button
          type="button"
          className="mobile-filter-toggle-btn"
          onClick={() => setMobileDrawerOpen(prev => !prev)}
          aria-expanded={mobileDrawerOpen}
          aria-label="Toggle sidebar filters, explorers, and community guidelines"
        >
          <span className="mobile-filter-toggle-left">
            <SlidersHorizontal size={16} />
            <span>Categories, Guides & Guidelines</span>
          </span>
          <span className="mobile-filter-toggle-right">
            {activeFiltersCount > 0 && (
              <span className="mobile-filter-count-badge">{activeFiltersCount}</span>
            )}
            {mobileDrawerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Active Filter Chips on Mobile (Scrollable horizontally without overflow) */}
        {(activeCategory !== 'all' || activeCity) && (
          <div className="mobile-active-chips" role="status">
            {activeCategory !== 'all' && activeCategoryObj && (
              <span className="mobile-chip">
                {activeCategoryObj.emoji} {activeCategoryObj.label}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  aria-label={`Remove category filter ${activeCategoryObj.label}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {activeCity && (
              <span className="mobile-chip">
                📍 {activeCity}
                <button
                  type="button"
                  onClick={() => handleSelectCity(activeCity)}
                  aria-label={`Remove destination filter ${activeCity}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              type="button"
              className="mobile-chip-reset"
              onClick={handleResetFilters}
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* =========================================
          THE DEDICATED LEFT NAVIGATION SIDEBAR
         ========================================= */}
      <aside
        className={`community-left-sidebar${mobileDrawerOpen ? ' mobile-drawer-open' : ''}`}
        aria-label="Categories and Destinations Navigation Sidebar"
      >
        {/* ALL POSTS (RESET OPTION) */}
        <section className="sidebar-all-posts-section">
          <button
            type="button"
            id="nav-all-posts-btn"
            className={`nav-all-posts-btn${isAllActive ? ' active' : ''}`}
            onClick={() => {
              handleResetFilters();
              setMobileDrawerOpen(false);
            }}
            aria-pressed={isAllActive}
          >
            <div className="nav-all-posts-left">
              <span className="nav-all-label">All Travel Stories</span>
            </div>
            <span className="nav-all-count">{allPostsCount}</span>
          </button>
        </section>

        {/* ACTIVE FILTER SUMMARY CHIP BANNER */}
        {(!isAllActive && (activeCategory !== 'all' || activeCity)) && (
          <div className="sidebar-active-summary" role="status">
            <div className="sidebar-active-summary__text">
              <span className="summary-label">Filtered by:</span>
              <div className="summary-tags">
                {activeCategory !== 'all' && activeCategoryObj && (
                  <span className="summary-badge">
                    {activeCategoryObj.emoji} {activeCategoryObj.label}
                  </span>
                )}
                {activeCity && (
                  <span className="summary-badge">
                    📍 {activeCity}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="sidebar-active-reset-btn"
              onClick={handleResetFilters}
              title="Reset all active filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        )}

        {/* =========================================
            SECTION 1: CATEGORIES
           ========================================= */}
        <section className="sidebar-nav-section" aria-label="Categories">
          <div className="sidebar-nav-heading">
            <Layers size={17} className="sidebar-heading-icon" />
            <h3>Categories</h3>
          </div>

          <div className="sidebar-categories-list" role="list">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-btn-${cat.id}`}
                  className={`sidebar-category-btn${isActive ? ' active' : ''}`}
                  onClick={() => {
                    handleCategoryChange(cat.id);
                    setMobileDrawerOpen(false);
                  }}
                  aria-pressed={isActive}
                >
                  <span className="sidebar-cat-emoji">{cat.emoji}</span>
                  <span className="sidebar-cat-label">{cat.label}</span>
                  {isActive && <Check size={14} className="sidebar-cat-check" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================
            SECTION 2: DESTINATIONS
           ========================================= */}
        <section className="sidebar-nav-section" aria-label="Destinations">
          <div className="sidebar-nav-heading">
            <MapPin size={17} className="sidebar-heading-icon" />
            <h3>Destinations</h3>
          </div>

          <p className="sidebar-nav-subtitle">
            Filter stories by trending hubs & valleys:
          </p>

          <div className="cities-filter-list" role="list">
            {displayedCities.map((city) => {
              const isSelected = activeCity === city.name;
              return (
                <button
                  key={city.id}
                  type="button"
                  id={`city-btn-${city.id}`}
                  className={`city-filter-btn${isSelected ? ' active' : ''}`}
                  onClick={() => {
                    handleSelectCity(city.name);
                    setMobileDrawerOpen(false);
                  }}
                  aria-pressed={isSelected}
                >
                  <span className="city-filter-emoji">{city.emoji}</span>
                  <div className="city-filter-info">
                    <span className="city-filter-name">{city.name}</span>
                    <span className="city-filter-state">{city.state}</span>
                  </div>
                  {city.isTrending && (
                    <span className="city-trending-badge" title="Trending destination">
                      <Flame size={11} /> Hot
                    </span>
                  )}
                  {isSelected && (
                    <span className="city-active-check">
                      <Check size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="cities-toggle-more-btn"
            onClick={() => setShowAllCities((prev) => !prev)}
            aria-expanded={showAllCities}
          >
            {showAllCities ? (
              <>Show fewer destinations <ChevronUp size={14} /></>
            ) : (
              <>+{POPULAR_CITIES.length - 7} more destinations <ChevronDown size={14} /></>
            )}
          </button>
        </section>

        {/* =========================================
            SECTION 3: ACTIVE EXPLORERS & GUIDES
           ========================================= */}
        <section id="contributors" className="sidebar-nav-section" aria-label="Active Explorers & Guides">
          <div className="sidebar-nav-heading">
            <HeartHandshake size={17} className="sidebar-heading-icon" />
            <h3>Active Explorers & Guides</h3>
          </div>

          <p className="sidebar-nav-subtitle">
            Local trip leaders & seasoned wanderers:
          </p>

          <div className="contributors-list" role="list">
            {TOP_CONTRIBUTORS.map((contributor) => {
              const isFollowing = followedUsers?.has ? followedUsers.has(contributor.name) : false;
              return (
                <div key={contributor.id} className="contributor-item">
                  <div
                    className="contributor-avatar"
                    style={{ backgroundColor: contributor.avatarBg }}
                    aria-hidden="true"
                  >
                    {contributor.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="contributor-details">
                    <div className="contributor-name-row">
                      <span className="contributor-name">{contributor.name}</span>
                      <span className="contributor-karma">{contributor.karma}</span>
                    </div>
                    <span className="contributor-badge">{contributor.badge}</span>
                    <p className="contributor-bio">{contributor.bio}</p>
                  </div>

                  <button
                    type="button"
                    className={`contributor-connect-btn${isFollowing ? ' connected' : ''}`}
                    onClick={() => handleToggleFollow && handleToggleFollow(contributor.name)}
                    aria-label={isFollowing ? `Connected with ${contributor.name}` : `Connect with ${contributor.name}`}
                    title={isFollowing ? 'Connected' : 'Connect'}
                  >
                    {isFollowing ? <Check size={14} /> : <UserPlus size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            SECTION 4: COMMUNITY GUIDELINES
           ========================================= */}
        <section id="guidelines" className="sidebar-nav-section" aria-label="Community Guidelines">
          <div className="sidebar-nav-heading">
            <Shield size={17} className="sidebar-heading-icon" />
            <h3>Community Guidelines</h3>
          </div>

          <p className="sidebar-nav-subtitle">
            Abeon principles for mindful & honest travel:
          </p>

          <div className="rules-list" role="list">
            {COMMUNITY_RULES.map((rule) => {
              const isExpanded = expandedRule === rule.num;
              return (
                <div key={rule.num} className="rule-item">
                  <button
                    type="button"
                    className={`rule-header${isExpanded ? ' expanded' : ''}`}
                    onClick={() => setExpandedRule(isExpanded ? null : rule.num)}
                    aria-expanded={isExpanded}
                  >
                    <span className="rule-num">{rule.num}.</span>
                    <span className="rule-title">{rule.title}</span>
                    {isExpanded ? <ChevronUp size={13} className="rule-chevron" /> : <ChevronDown size={13} className="rule-chevron" />}
                  </button>
                  {isExpanded && (
                    <div className="rule-desc">
                      <p>{rule.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </aside>
    </>
  );
}
