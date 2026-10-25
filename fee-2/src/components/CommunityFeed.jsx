import { useCommunity } from '../context/CommunityContext.jsx';
import NavigationSidebar from './NavigationSidebar.jsx';
import CommunityBanner from './CommunityBanner.jsx';
import CreatePostQuickBox from './CreatePostQuickBox.jsx';
import FeedSortBar from './FeedSortBar.jsx';
import PostCard from './PostCard.jsx';
import '../styles/community.css';

export default function CommunityFeed() {
  const {
    filteredPosts,
    showSavedOnly,
    clearFilters,
  } = useCommunity();

  return (
    <div className="community-feed-layout">
      {/* =========================================
          LEFT SIDEBAR:
          Categories → Destinations → Active Explorers & Guides → Community Guidelines
         ========================================= */}
      <NavigationSidebar />

      {/* =========================================
          MAIN CONTENT AREA:
          Wide and focused exclusively on the community header,
          Share Story / Ask Advice button, sorting controls, posts, and discussions.
         ========================================= */}
      <div className="community-main-column">
        {/* 1. Community Header */}
        <CommunityBanner />

        {/* 2. Post Feed & Post Interactions */}
        <section className="feed-stream-column" aria-label="Community Discussions Feed">
          {/* Quick Post Composer */}
          <CreatePostQuickBox />

          {/* Sort & Flairs Bar (Hot, New, Top, Discussed) */}
          <FeedSortBar />

          {/* Empty State or Post Stream */}
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">
                {showSavedOnly ? '🔖' : '🧭'}
              </div>
              <h3 className="empty-state__title">
                {showSavedOnly ? 'No saved stories yet' : 'No matching stories found'}
              </h3>
              <p className="empty-state__text">
                {showSavedOnly
                  ? 'Click the bookmark icon on any travel story to save it for quick reference while on the road.'
                  : 'Try broadening your search keywords or switch category flairs to discover more genuine stories.'}
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="feed-stream">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* End of Stream Encouragement */}
              <div className="feed-stream__end">
                <div className="feed-stream__end-icon">✨</div>
                <h4>You've caught up on all current stories!</h4>
                <p>Have an adventure or an offbeat tip of your own to share?</p>
                <CreatePostQuickBox />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
