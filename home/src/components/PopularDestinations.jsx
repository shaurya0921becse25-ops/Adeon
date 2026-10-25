export default function PopularDestinations({ children }) {
  return (
    <section className="destinations-section" id="destinations" aria-labelledby="destinations-title">
      <div className="destinations-heading">
        <span className="section-eyebrow">GO SOMEWHERE THAT MOVES YOU</span>
        <h2 id="destinations-title">Popular Destinations</h2>
        <p>Find a place that speaks to you. Your next story starts out there.</p>
      </div>
      {children}
      <p className="gallery-hint">Drag to explore · Select a place to discover more</p>
    </section>
  );
}