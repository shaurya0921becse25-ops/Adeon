import { useState } from 'react';
import {
  Compass,
  Users,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  UserPlus,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { TOP_CONTRIBUTORS, COMMUNITY_RULES } from '../data/samplePosts.js';
import '../styles/community.css';

export default function CommunityInfoCard() {
  const {
    allPostsCount,
    destinationsCount,
    contributorsCount,
    communityJoined,
    handleToggleJoin,
    setCreateModalOpen,
    handleToggleFollow,
    followedUsers,
  } = useCommunity();

  const [expandedRule, setExpandedRule] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showExplorers, setShowExplorers] = useState(false);

  return (
    <section className="community-info-card" aria-label="Community Information and Guidelines">
      {/* Header Banner & Profile */}
      <div className="about-widget__header">
        <div className="about-widget__banner" aria-hidden="true" />
        <div className="about-widget__profile">
          <div className="about-widget__avatar">
            <Compass size={24} />
          </div>
          <div>
            <h2 className="about-widget__title">Abeon</h2>
            <span className="about-widget__subtitle">Est. 2026 · Global Travel Community</span>
          </div>
        </div>
      </div>

      <div className="about-widget__body">
        <p className="about-widget__desc">
          Abeon is a collective of backpackers, solo wanderers, and conscious travelers. We share
          authentic ground realities, honest budgets, secret viewpoints, and build genuine friendships.
        </p>

        {/* Honest, genuine statistics derived dynamically from the active posts data */}
        <div className="about-widget__stats">
          <div className="stat-item">
            <span className="stat-number">{allPostsCount}</span>
            <span className="stat-label">Stories</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{destinationsCount}</span>
            <span className="stat-label">Destinations</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{contributorsCount}</span>
            <span className="stat-label">Contributors</span>
          </div>
        </div>

        {/* Community Actions */}
        <div className="about-widget__actions">
          <button
            type="button"
            className={`btn ${communityJoined ? 'btn-secondary btn-joined' : 'btn-primary'} btn-block`}
            onClick={handleToggleJoin}
            aria-label={communityJoined ? 'Joined Abeon' : 'Join Community'}
          >
            {communityJoined ? (
              <>
                <Check size={16} /> Joined Abeon
              </>
            ) : (
              <>
                <Users size={16} /> Join Community
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => setCreateModalOpen(true)}
            aria-label="Share your travel experience"
          >
            ✍️ Share Story / Ask Advice
          </button>
        </div>

        {/* Quick Drawer Toggles for Guidelines & Active Explorers */}
        <div className="community-info-card__expanders">
          {/* Abeon Guidelines Toggle */}
          <button
            type="button"
            className="info-expander-btn"
            onClick={() => setShowGuidelines((prev) => !prev)}
            aria-expanded={showGuidelines}
          >
            <span className="info-expander-label">
              <Shield size={15} /> Community Guidelines
            </span>
            {showGuidelines ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showGuidelines && (
            <div className="rules-list rules-list--inline">
              {COMMUNITY_RULES.map((rule) => {
                const isExpanded = expandedRule === rule.num;
                return (
                  <div key={rule.num} className="rule-item">
                    <button
                      type="button"
                      className="rule-header"
                      onClick={() => setExpandedRule(isExpanded ? null : rule.num)}
                      aria-expanded={isExpanded}
                    >
                      <span className="rule-num">{rule.num}.</span>
                      <span className="rule-title">{rule.title}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isExpanded && (
                      <div className="rule-desc">
                        <p>{rule.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Explorers Toggle */}
          <button
            type="button"
            className="info-expander-btn"
            onClick={() => setShowExplorers((prev) => !prev)}
            aria-expanded={showExplorers}
          >
            <span className="info-expander-label">
              <HeartHandshake size={15} /> Active Explorers & Guides
            </span>
            {showExplorers ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showExplorers && (
            <div className="contributors-list contributors-list--inline">
              {TOP_CONTRIBUTORS.map((contributor) => {
                const isFollowing = followedUsers.has(contributor.name);
                return (
                  <div key={contributor.id} className="contributor-item">
                    <div
                      className="contributor-avatar"
                      style={{ backgroundColor: contributor.avatarBg }}
                      aria-hidden="true"
                    >
                      {contributor.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="contributor-details">
                      <div className="contributor-name-row">
                        <span className="contributor-name">{contributor.name}</span>
                        <span className="contributor-karma">{contributor.karma}</span>
                      </div>
                      <span className="contributor-badge">{contributor.badge}</span>
                      <p className="contributor-bio">{contributor.bio}</p>
                    </div>

                    <button
                      type="button"
                      className={`contributor-connect-btn${isFollowing ? ' connected' : ''}`}
                      onClick={() => handleToggleFollow(contributor.name)}
                      aria-label={isFollowing ? `Connected with ${contributor.name}` : `Connect with ${contributor.name}`}
                      title={isFollowing ? 'Connected' : 'Connect'}
                    >
                      {isFollowing ? <Check size={14} /> : <UserPlus size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
