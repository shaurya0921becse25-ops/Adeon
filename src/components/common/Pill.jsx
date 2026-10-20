import React from 'react';
import './Pill.css';

/**
 * Pill/Tag Primitive
 * Interactive chip or static tag, removable with 'onRemove'
 */
export default function Pill({
  children,
  variant = 'default', // 'default' | 'accent' | 'sand' | 'active'
  selected = false,
  interactive = false,
  onRemove = null,
  onClick = null,
  className = '',
  ...props
}) {
  const isClickable = interactive || !!onClick;

  return (
    <span
      className={`ww-pill ww-pill--${variant} ${selected ? 'is-selected' : ''} ${isClickable ? 'is-clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(e);
        }
      } : undefined}
      {...props}
    >
      <span className="ww-pill__content">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="ww-pill__remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove filter"
        >
          &times;
        </button>
      )}
    </span>
  );
}
