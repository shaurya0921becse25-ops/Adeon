import '../styles/community.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-text">
              Ab<span>eon</span>
            </div>
            <p className="footer__tagline">
              A community of passionate travellers discovering authentic destinations,
              sharing unfiltered experiences, and helping each other travel smarter.
            </p>
          </div>

          {/* Col 1 */}
          <div className="footer__col">
            <div className="footer__col-title">Explore</div>
            <ul className="footer__links">
              <li><a href="#mountains" className="footer__link">Mountains & Trekking</a></li>
              <li><a href="#heritage" className="footer__link">Culture & Heritage</a></li>
              <li><a href="#cafes" className="footer__link">Cafés & Food Trails</a></li>
              <li><a href="#hidden" className="footer__link">Hidden Gems</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="footer__col">
            <div className="footer__col-title">Community</div>
            <ul className="footer__links">
              <li><a href="#stories" className="footer__link">Featured Stories</a></li>
              <li><a href="#tips" className="footer__link">Insider Tips</a></li>
              <li><a href="#guidelines" className="footer__link">Community Guidelines</a></li>
              <li><a href="#contributors" className="footer__link">Top Travellers</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer__col">
            <div className="footer__col-title">About</div>
            <ul className="footer__links">
              <li><a href="#about" className="footer__link">About Abeon</a></li>
              <li><a href="#safety" className="footer__link">Travel Safety</a></li>
              <li><a href="#privacy" className="footer__link">Privacy Policy</a></li>
              <li><a href="#contact" className="footer__link">Contact Team</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <div className="footer__copy">
            © {CURRENT_YEAR} Abeon Inc. Crafted for conscious explorers worldwide.
          </div>
          <div className="footer__motto">
            Explore with curiosity, wander with wisdom. 🌍
          </div>
        </div>
      </div>
    </footer>
  );
}
