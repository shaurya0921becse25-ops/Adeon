import React from 'react';
import './Avatar.css';

export default function Avatar({
  src = null,
  name = 'Traveler',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  status = null, // 'guide' | 'online'
  ...props
}) {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`ww-avatar ww-avatar--${size} ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="ww-avatar__img"
          loading="lazy"
          width="48"
          height="48"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className="ww-avatar__fallback" aria-label={name}>
          {initials}
        </span>
      )}
      {status === 'guide' && (
        <span className="ww-avatar__badge ww-avatar__badge--guide" title="Local Guide" aria-label="Local Guide">
          ★
        </span>
      )}
    </div>
  );
}
