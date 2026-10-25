export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
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
        <div className="hero-kicker" aria-label="Travel, explore, transform">
          <span>TRAVEL</span>
          <span>EXPLORE</span>
          <span>TRANSFORM</span>
        </div>
        <h1 className="hero-title" id="hero-title">
          <span>EXPLORE</span>
          <span>JOURNEY</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Uncover hidden places,
            <br />
            breathtaking landscapes, and
            <br />
            unforgettable moments crafted
            <br />
            for true explorers.
          </p>
          <div className="hero-actions">
            <a className="hero-button hero-button-outline" href="#trip-finder">Trip Finder</a>
            <a className="hero-button hero-button-light" href="#planning">Plan my Trip</a>
          </div>
        </div>
      </div>
      <a className="hero-scroll" href="#destinations" aria-label="Scroll to popular destinations">
        <span />
      </a>
    </section>
  );
}