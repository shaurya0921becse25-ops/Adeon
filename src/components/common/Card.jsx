import React from 'react';
import './Card.css';

export default function Card({
  children,
  variant = 'default', // 'default' | 'sand' | 'tint' | 'outline' | 'dark'
  interactive = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <div
      className={`ww-card ww-card--${variant} ${interactive ? 'is-interactive' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(e);
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
