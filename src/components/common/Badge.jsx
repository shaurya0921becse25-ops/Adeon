import React from 'react';
import './Badge.css';

/**
 * Status Badge Primitive
 * Ensures WCAG AA accessibility: always renders icon + text, never colour alone
 */
export default function Badge({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'accent' | 'neutral' | 'sage'
  icon = null,
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <span className={`ww-badge ww-badge--${variant} ww-badge--${size} ${className}`} {...props}>
      {icon && <span className="ww-badge__icon" aria-hidden="true">{icon}</span>}
      <span className="ww-badge__label">{children}</span>
    </span>
  );
}
