import React, { forwardRef } from 'react';
import './FormField.css';

/**
 * Accessible FormField Primitive
 * Handles Label, Required indicator, Input / Select / Textarea, Helper text, and Error text with aria-describedby
 */
const FormField = forwardRef(function FormField(
  {
    as = 'input', // 'input' | 'select' | 'textarea'
    id,
    label,
    required = false,
    error = null,
    hint = null,
    className = '',
    children,
    characterCount = null, // { current, min, max, isWarning, isDanger }
    ...props
  },
  ref
) {
  const inputId = id || `ww-field-${Math.random().toString(36).substr(2, 6)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const Component = as;

  return (
    <div className={`ww-form-field ${error ? 'has-error' : ''} ${className}`}>
      <div className="ww-form-field__label-row">
        <label htmlFor={inputId} className="ww-form-field__label">
          {label}
          {required && <span className="ww-form-field__required" aria-hidden="true">*</span>}
        </label>
        {characterCount && (
          <span
            className={`ww-form-field__counter ${
              characterCount.isDanger
                ? 'is-danger'
                : characterCount.isWarning
                ? 'is-warning'
                : ''
            }`}
            aria-live="polite"
          >
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </div>

      <div className="ww-form-field__control-wrap">
        <Component
          ref={ref}
          id={inputId}
          className={`ww-form-control ww-form-control--${as} ${error ? 'is-invalid' : ''}`}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </Component>
      </div>

      {hint && !error && (
        <p id={hintId} className="ww-form-field__hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="ww-form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;
