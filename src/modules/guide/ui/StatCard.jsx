import React from "react";
import Card from "./card";

export default function StatCard({ icon: Icon, label, value, change }) {
  // Purely presentational SVG sparklines matching the warm earthy vibe
  const isUp = change && (change.includes("+") || change.includes("★") || change.includes("↑"));

  return (
    <Card className="stat-card-modern">
      <div className="stat-card-top">
        <div className="stat-icon-wrapper">
          <Icon size={22} className="stat-icon-svg" />
        </div>
        <div className="stat-sparkline" aria-hidden="true">
          <svg width="68" height="28" viewBox="0 0 68 28" fill="none">
            <path
              d="M2 22C10 20 16 25 24 16C32 7 38 18 46 12C54 6 60 10 66 4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="66" cy="4" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="stat-card-body">
        <p className="stat-label">{label}</p>
        <div className="stat-value-row">
          <span className="stat-value">{value}</span>
        </div>
        {change && (
          <div className={`stat-change-tag ${isUp ? "positive" : "neutral"}`}>
            <span>{change}</span>
          </div>
        )}
      </div>
    </Card>
  );
}