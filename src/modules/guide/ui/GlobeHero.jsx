import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "./cobe-globe";

const travelMarkers = [
  { id: "himachal", location: [32.2432, 77.1892], label: "Manali · Host Base" },
  { id: "delhi", location: [28.6139, 77.209], label: "New Delhi" },
  { id: "london", location: [51.5074, -0.1278], label: "London" },
  { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
  { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
  { id: "sf", location: [37.7595, -122.4367], label: "San Francisco" },
  { id: "paris", location: [48.8566, 2.3522], label: "Paris" },
];

const markerColor = [0.85, 0.36, 0.12];
const baseColor = [0.28, 0.43, 0.52];
const arcColor = [0.85, 0.45, 0.15];
const glowColor = [0.98, 0.9, 0.8];

const travelArcs = [
  {
    id: "london-manali",
    from: [51.5074, -0.1278],
    to: [32.2432, 77.1892],
    label: "London → Manali",
  },
  {
    id: "dubai-delhi",
    from: [25.2048, 55.2708],
    to: [28.6139, 77.209],
    label: "Dubai → Delhi",
  },
  {
    id: "sf-tokyo",
    from: [37.7595, -122.4367],
    to: [35.6762, 139.6503],
    label: "SF → Tokyo",
  },
];

export default function GlobeHero({
  profileName = "Agam",
  pendingBookingsCount = 0,
}) {
  return (
    <section className="globe-hero">
      <div className="globe-hero-glow"></div>

      <div className="globe-hero-content">
        <h1 className="hero-heading">
          Welcome back, <span className="hero-highlight">{profileName}</span>!
        </h1>

        <p className="hero-description">
          Your authentic mountain treks &amp; curated local experiences are
          inspiring travelers from around the world.
        </p>

        <div className="hero-actions">
          <Link to="/guide/services/new" className="btn btn-primary btn-hero">
            + Add New Experience
          </Link>
          <Link to="/guide/bookings" className="btn btn-hero-outline">
            Review Bookings ({pendingBookingsCount} pending)
          </Link>
        </div>
      </div>

      <div className="globe-container-wrapper">
        <Globe
          markers={travelMarkers}
          arcs={travelArcs}
          markerColor={markerColor}
          baseColor={baseColor}
          arcColor={arcColor}
          glowColor={glowColor}
          dark={0}
          mapBrightness={8}
          markerSize={0.03}
          markerElevation={0.015}
          arcWidth={0.65}
          arcHeight={0.28}
          speed={0.003}
          className="hero-cobe-globe"
        />
      </div>
    </section>
  );
}
