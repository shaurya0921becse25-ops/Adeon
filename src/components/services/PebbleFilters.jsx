import React from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { SERVICE_TYPES } from '../../data/servicesSeed';
import { formatINR } from '../../utils/formatters';
import './PebbleFilters.css';

export default function PebbleFilters({
  activeType,
  onTypeChange,
  priceMax,
  onPriceMaxChange,
  language,
  onLanguageChange,
  minRating,
  onMinRatingChange,
  onlyAvailableOnDate,
  onOnlyAvailableOnDateChange,
  sortOption,
  onSortChange,
  onOpenDrawer,
  onResetFilters,
  resultCount,
  chosenDate
}) {
  const hasActiveFilters =
    activeType !== 'All' ||
    priceMax < 10000 ||
    language !== 'All' ||
    minRating > 0 ||
    onlyAvailableOnDate;

  return (
    <div className="pebble-filters-wrap">
      {/* Top Row: Type Pebble Chips + Drawer Button + Sort */}
      <div className="pebble-filters-row">
        {/* Type Pebble Chips */}
        <div className="pebble-chips-container" role="tablist" aria-label="Filter services by type">
          <button
            type="button"
            className={`pebble-chip ${activeType === 'All' ? 'is-active' : ''}`}
            onClick={() => onTypeChange('All')}
            role="tab"
            aria-selected={activeType === 'All'}
          >
            All Services
          </button>
          {SERVICE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`pebble-chip ${activeType === type ? 'is-active' : ''}`}
              onClick={() => onTypeChange(type)}
              role="tab"
              aria-selected={activeType === type}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Drawer Trigger & Sort */}
        <div className="filters-right-actions">
          <button
            type="button"
            className={`more-filters-btn ${hasActiveFilters ? 'has-active' : ''}`}
            onClick={onOpenDrawer}
            aria-label="Open filter drawer"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {hasActiveFilters && <span className="filters-active-dot" />}
          </button>

          <div className="sort-dropdown-wrap">
            <label htmlFor="service-sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="service-sort-select"
              className="service-sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="best_match">Sort: Best match</option>
              <option value="price_low">Price: Low to high</option>
              <option value="price_high">Price: High to low</option>
              <option value="rating">Rating: Highest first</option>
              <option value="soonest">Soonest available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Row */}
      {hasActiveFilters && (
        <div className="active-filter-chips-row">
          <span className="active-filters-label">Active:</span>

          {activeType !== 'All' && (
            <span className="active-tag-chip">
              Type: {activeType}
              <button
                type="button"
                onClick={() => onTypeChange('All')}
                aria-label={`Remove ${activeType} filter`}
              >
                <X size={12} />
              </button>
            </span>
          )}

          {priceMax < 10000 && (
            <span className="active-tag-chip">
              Under {formatINR(priceMax)}
              <button
                type="button"
                onClick={() => onPriceMaxChange(10000)}
                aria-label="Remove max price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {language !== 'All' && (
            <span className="active-tag-chip">
              Lang: {language}
              <button
                type="button"
                onClick={() => onLanguageChange('All')}
                aria-label={`Remove ${language} language filter`}
              >
                <X size={12} />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="active-tag-chip">
              Rating &ge; {minRating}&#9733;
              <button
                type="button"
                onClick={() => onMinRatingChange(0)}
                aria-label="Remove rating filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {onlyAvailableOnDate && (
            <span className="active-tag-chip">
              Available on {chosenDate}
              <button
                type="button"
                onClick={() => onOnlyAvailableOnDateChange(false)}
                aria-label="Remove date availability filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          <button
            type="button"
            className="clear-all-filters-btn"
            onClick={onResetFilters}
          >
            <RotateCcw size={12} /> Reset all
          </button>
        </div>
      )}
    </div>
  );
}
