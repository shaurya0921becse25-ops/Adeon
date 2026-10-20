import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle = null,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'full'
  className = ''
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save active element to restore later
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    // Focus first interactive element in modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="ww-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`ww-modal-dialog ww-modal-dialog--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ww-modal-title"
      >
        <div className="ww-modal-header">
          <div>
            <h2 id="ww-modal-title" className="ww-modal-title">{title}</h2>
            {subtitle && <p className="ww-modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="ww-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="ww-modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
