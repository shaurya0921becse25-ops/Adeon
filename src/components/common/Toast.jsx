import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 size={18} strokeWidth={1.5} />,
    warning: <AlertTriangle size={18} strokeWidth={1.5} />,
    danger: <AlertCircle size={18} strokeWidth={1.5} />,
    info: <Info size={18} strokeWidth={1.5} />
  };

  return (
    <div className="ww-toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`ww-toast ww-toast--${toast.type || 'info'}`}>
          <span className="ww-toast__icon">
            {icons[toast.type] || icons.info}
          </span>
          <p className="ww-toast__message">{toast.message}</p>
          <button
            type="button"
            className="ww-toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
