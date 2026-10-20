import React from 'react';
import './Button.css';

/**
 * Reusable Button Primitive
 * Variants: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
 * Sizes: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={`ww-btn ww-btn--${variant} ww-btn--${size} ${isLoading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="ww-btn__spinner" aria-hidden="true" />
      ) : (
        leftIcon && <span className="ww-btn__icon ww-btn__icon--left">{leftIcon}</span>
      )}
      <span className="ww-btn__text">{children}</span>
      {!isLoading && rightIcon && (
        <span className="ww-btn__icon ww-btn__icon--right">{rightIcon}</span>
      )}
    </button>
  );
}
