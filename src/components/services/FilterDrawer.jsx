import React from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import Button from '../common/Button';
import './FilterDrawer.css';

const LANGUAGES = ['All', 'English', 'Hindi', 'Pahari', 'Japanese', 'German', 'Thai', 'Arabic', 'Konkani'];
const RATINGS = [
  { label: 'Any rating', val: 0 },
  { label: '4.0 & above', val: 4.0 },
  { label: '4.5 & above', val: 4.5 },
  { label: '4.8 & above', val: 4.8 }
];

export default function FilterDrawer({
  isOpen,
  onClose,
  priceMax,
  onPriceMaxChange,
  language,
  onLanguageChange,
  minRating,
  onMinRatingChange,
  onlyAvailableOnDate,
  onOnlyAvailableOnDateChange,
  onResetFilters,
  chosenDate,
  totalMatchingCount
}) {
  if (!isOpen) return null;

  return (
    <div className="filter-drawer-backdrop" onClick={onClose}>
      <aside
        className="filter-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
      >
        <div className="filter-drawer-header">
          <div>
            <h3 id="filter-drawer-title" className="filter-drawer-title">
              Filter Local Services
            </h3>
            <span className="filter-drawer-subtitle">
              Refine results by budget, languages & dates
            </span>
          </div>
          <button
            type="button"
            className="filter-drawer-close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-drawer-body">
          {/* 1. Price Max Slider */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label htmlFor="price-slider" className="filter-section-title">
                Maximum Price
              </label>
              <span className="filter-price-val tabular-nums">
                Up to {formatINR(priceMax)}
              </span>
            </div>
            <input
              id="price-slider"
              type="range"
              min="800"
              max="10000"
              step="200"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
              className="filter-range-input"
            />
            <div className="filter-range-labels tabular-nums">
              <span>{formatINR(800)}</span>
              <span>{formatINR(5000)}</span>
              <span>{formatINR(10000)}</span>
            </div>
          </div>

          {/* 2. Date Availability Checkbox */}
          <div className="filter-section">
            <label className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={onlyAvailableOnDate}
                onChange={(e) => onOnlyAvailableOnDateChange(e.target.checked)}
                className="filter-checkbox"
              />
              <div>
                <strong>Available on chosen date</strong>
                <p className="filter-checkbox-sub">
                  Only show guides with slots on {chosenDate || 'your trip date'}
                </p>
              </div>
            </label>
          </div>

          {/* 3. Language Selector */}
          <div className="filter-section">
            <span className="filter-section-title">Spoken Language</span>
            <div className="filter-pill-grid">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`filter-grid-pill ${language === lang ? 'is-active' : ''}`}
                  onClick={() => onLanguageChange(lang)}
                >
                  {language === lang && <Check size={12} />}
                  <span>{lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Minimum Rating */}
          <div className="filter-section">
            <span className="filter-section-title">Minimum Rating</span>
            <div className="filter-rating-options">
              {RATINGS.map((r) => (
                <button
                  key={r.val}
                  type="button"
                  className={`filter-rating-btn ${minRating === r.val ? 'is-active' : ''}`}
                  onClick={() => onMinRatingChange(r.val)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-drawer-footer">
          <Button
            variant="ghost"
            size="md"
            onClick={onResetFilters}
            leftIcon={<RotateCcw size={14} />}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="filter-apply-btn"
          >
            Show {totalMatchingCount} {totalMatchingCount === 1 ? 'service' : 'services'}
          </Button>
        </div>
      </aside>
    </div>
  );
}
