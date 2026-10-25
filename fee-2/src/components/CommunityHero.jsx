import { useCommunity } from '../context/CommunityContext.jsx';
import SearchBar from './SearchBar.jsx';
import '../styles/community.css';

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=80&auto=format&fit=crop',
    alt: 'Colorful streets of Jaipur, Rajasthan',
    className: 'hero__img hero__img--tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80&auto=format&fit=crop',
    alt: 'Snow-capped peaks in Manali, Himachal Pradesh',
    className: 'hero__img hero__img--short',
  },
  {
    src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80&auto=format&fit=crop',
    alt: 'Lake Pichola at golden hour, Udaipur',
    className: 'hero__img hero__img--short',
  },
];

export default function CommunityHero() {
  const { setCreateModalOpen, allPostsCount } = useCommunity();

  return (
    <section
      className="hero"
      aria-label="Community hero section"
    >
      <div className="hero__bg" aria-hidden="true" />

      <div className="hero__inner">
        {/* Left — copy */}
        <div className="hero__content">
          <div className="hero__label" aria-hidden="true">
            <span>🌍</span>
            <span>Travel Community</span>
          </div>

          <h1 className="hero__title">
            The world is better when we{' '}
            <em>explore it together.</em>
          </h1>

          <p className="hero__subtitle">
            Discover hidden gems, exchange travel tips, and find your
            next favourite place through the experiences of fellow travellers.
          </p>

          <div className="hero__actions">
            <button
              id="hero-share-btn"
              className="btn btn-primary"
              onClick={() => setCreateModalOpen(true)}
              aria-label="Open form to share your travel experience"
            >
              ✍️ Share Your Experience
            </button>
            <SearchBar />
          </div>

          <div className="hero__stats" aria-label="Community statistics">
            <div>
              <div className="hero__stat-number">{allPostsCount}+</div>
              <div className="hero__stat-label">Stories Shared</div>
            </div>
            <div>
              <div className="hero__stat-number">38</div>
              <div className="hero__stat-label">Destinations</div>
            </div>
            <div>
              <div className="hero__stat-number">1.2k</div>
              <div className="hero__stat-label">Travellers</div>
            </div>
          </div>
        </div>

        {/* Right — image collage (hidden on mobile) */}
        <div className="hero__visual" aria-hidden="true">
          {HERO_IMAGES.map((img, i) => (
            <div key={i} className={img.className}>
              <img src={img.src} alt={img.alt} loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
