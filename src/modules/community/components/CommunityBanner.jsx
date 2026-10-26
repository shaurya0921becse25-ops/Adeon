import { Users, UserPlus, Check, Sparkles, MapPin } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import SearchBar from './SearchBar.jsx';
import '../styles/community.css';

export default function CommunityBanner() {
  const {
    allPostsCount,
    destinationsCount,
    contributorsCount,
    communityJoined,
    handleToggleJoin,
    setCreateModalOpen,
  } = useCommunity();

  return (
    <header className="reddit-banner" role="banner">
      {/* Scenic Backdrop */}
      <div className="reddit-banner__bg" aria-hidden="true">
        <div className="reddit-banner__glow" />
      </div>

      <div className="reddit-banner__container">
        <div className="reddit-banner__main">
          {/* Title & Metadata (Abeon branding, no w/ prefix, Est. 2026) */}
          <div className="reddit-banner__info">
            <div className="reddit-banner__title-row">
              <h1 className="reddit-banner__title">Abeon</h1>
              <span className="reddit-banner__tag">Est. 2026 · Global Travel Community</span>
            </div>

            <p className="reddit-banner__tagline">
              Real stories, honest local budgets, and authentic connections from travelers on the ground.
            </p>

            {/* Honest, dynamically calculated statistics from actual dataset */}
            <div className="reddit-banner__meta-stats">
              <span className="reddit-banner__stat">
                <Sparkles size={14} aria-hidden="true" />
                <strong>{allPostsCount}</strong> Stories Shared
              </span>
              <span className="reddit-banner__stat-divider">•</span>
              <span className="reddit-banner__stat">
                <MapPin size={14} aria-hidden="true" />
                <strong>{destinationsCount}</strong> Destinations
              </span>
              <span className="reddit-banner__stat-divider">•</span>
              <span className="reddit-banner__stat">
                <Users size={14} aria-hidden="true" />
                <strong>{contributorsCount}</strong> Contributors
              </span>
            </div>
          </div>

          {/* Banner Actions */}
          <div className="reddit-banner__actions">
            <button
              type="button"
              id="banner-join-btn"
              className={`btn ${communityJoined ? 'btn-secondary btn-joined' : 'btn-primary'}`}
              onClick={handleToggleJoin}
              aria-label={communityJoined ? 'Leave Community' : 'Join Community'}
            >
              {communityJoined ? (
                <>
                  <Check size={16} /> Joined
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Join Community
                </>
              )}
            </button>

            <button
              type="button"
              id="banner-create-btn"
              className="btn btn-primary"
              onClick={() => setCreateModalOpen(true)}
              aria-label="Share story or ask travel advice"
            >
              ✍️ Share Story / Ask Advice
            </button>
          </div>
        </div>

        {/* Integrated Quick Search on Banner */}
        <div className="reddit-banner__search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
