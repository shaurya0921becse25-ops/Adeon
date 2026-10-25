const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [["Home", "#home"], ["Explore", "#destinations"], ["Community", "#faq"]],
  },
  {
    title: "Trips",
    links: [["My Trips", "#planning"], ["Trip Finder", "#trip-finder"], ["Destinations", "#destinations"]],
  },
  {
    title: "Legal Page",
    links: [["Privacy Policy", "#privacy"], ["Terms Of Service", "#terms"]],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="trip-finder">
      <img
        className="footer-background"
        src="/media/footer-landscape.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="footer-shade" />
      <div className="footer-content">
        <div className="footer-cta">
          <h2>Your next adventure starts here</h2>
          <p>Explore remote landscapes, local stories, and unforgettable moments waiting beyond the next ridge.</p>
          <a href="#destinations">Explore Trips</a>
        </div>
        <div className="footer-details">
          <div className="footer-brand">
            <a href="#home">ABEON</a>
            <p>Guided journeys, breathtaking trails, and unforgettable travel experiences—all thoughtfully crafted in one place.</p>
            <span>© 2026 ABEON. All rights reserved.</span>
          </div>
          <div className="footer-link-columns">
            {FOOTER_LINKS.map((column) => (
              <div className="footer-link-column" key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-watermark" aria-hidden="true">Abeon</div>
    </footer>
  );
}