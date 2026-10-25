import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const scrollToDestinations = (e) => {
    e.preventDefault();
    const destEl = document.getElementById("destinations");
    if (destEl) {
      destEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="home" aria-labelledby="hero-title-explore">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/media/abeon-hero-ping-pong.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />

      <div className="hero-content">
        {/* Top Left Stacked Tagline */}
        <div className="hero-kicker" aria-label="Travel, explore, transform">
          <div>TRAVEL</div>
          <div>EXPLORE</div>
          <div>TRANSFORM</div>
        </div>

        {/* Main Large Display Text Grid — EXPLORE JOURNEY */}
        <div className="hero-display-grid">
          <div>
            <h1 className="hero-display-title" id="hero-title-explore">
              EXPLORE
            </h1>
          </div>
          <div>
            <h1 className="hero-display-title">
              JOURNEY
            </h1>
          </div>
        </div>

        {/* Bottom Section: Left Paragraph & Right Square Action Buttons */}
        <div className="hero-bottom">
          <div className="hero-desc-wrap">
            <p className="hero-desc-text">
              Uncover hidden places,
              <br />
              breathtaking landscapes, and
              <br />
              unforgettable moments crafted
              <br />
              for true explorers.
            </p>
          </div>

          <div className="hero-actions">
            <Link className="btn-sq btn-ghost-sq" to="/services">
              Trip Finder
            </Link>
            <Link className="btn-sq btn-solid-sq" to="/itinerary">
              Plan my Trip
            </Link>
          </div>
        </div>
      </div>

      <a
        className="hero-scroll"
        href="#destinations"
        onClick={scrollToDestinations}
        aria-label="Scroll to popular destinations"
      >
        <span />
      </a>
    </section>
  );
}
