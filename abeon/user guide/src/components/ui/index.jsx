import React from "react";

export const Button = ({
  children,
  variant = "primary", // primary, secondary, outline, ghost, dark
  size = "md", // sm, md, lg
  fullWidth = false,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" ? `btn-${size}` : "",
    fullWidth ? "btn-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({
  children,
  variant = "aegean", // aegean, limestone, success, outline
  className = "",
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const Card = ({
  children,
  className = "",
  hover = true,
  onClick,
  ...props
}) => {
  return (
    <div
      className={`card ${hover ? "lift-on-hover" : ""} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const Stepper = ({ value, min = 1, max = 10, onChange, label }) => {
  return (
    <div className="stepper" role="group" aria-label={label || "Quantity selector"}>
      <button
        type="button"
        className="stepper-btn"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="stepper-val">{value}</span>
      <button
        type="button"
        className="stepper-btn"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-heading">{title}</h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const Drawer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-heading">{title}</h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close drawer">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tabs-header" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.badge !== undefined && (
            <span style={{ marginLeft: 6, fontSize: "0.8em", opacity: 0.8 }}>({tab.badge})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export const Skeleton = ({ width = "100%", height = "20px", borderRadius = "var(--radius-md)", className = "" }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
};
