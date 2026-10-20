import React, { useState } from 'react';
import './StarRating.css';

/**
 * Accessible StarRating Primitive
 * Interactive mode: keyboard arrow navigation, hover, aria-valuenow
 * Display mode: read-only, numerical score
 */
export default function StarRating({
  value = 5,
  onChange = null,
  max = 5,
  size = 'md', // 'sm' | 'md' | 'lg'
  readOnly = false,
  showScore = true,
  className = '',
  name = 'star-rating'
}) {
  const [hoverVal, setHoverVal] = useState(0);

  const displayVal = hoverVal || value;

  const handleKeyDown = (e, star) => {
    if (readOnly || !onChange) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(star);
    }
  };

  return (
    <div
      className={`ww-star-rating ww-star-rating--${size} ${readOnly ? 'is-readonly' : 'is-interactive'} ${className}`}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `Rating: ${value} out of ${max} stars` : 'Rate this experience'}
    >
      <div className="ww-star-rating__stars">
        {Array.from({ length: max }, (_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= displayVal;

          if (readOnly) {
            return (
              <span
                key={starNumber}
                className={`ww-star ${isFilled ? 'is-filled' : 'is-empty'}`}
                aria-hidden="true"
              >
                ★
              </span>
            );
          }

          return (
            <button
              key={starNumber}
              type="button"
              className={`ww-star-btn ${isFilled ? 'is-filled' : 'is-empty'}`}
              role="radio"
              aria-checked={value === starNumber}
              aria-label={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
              onMouseEnter={() => setHoverVal(starNumber)}
              onMouseLeave={() => setHoverVal(0)}
              onClick={() => onChange && onChange(starNumber)}
              onKeyDown={(e) => handleKeyDown(e, starNumber)}
            >
              ★
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="ww-star-rating__score tabular-nums">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
