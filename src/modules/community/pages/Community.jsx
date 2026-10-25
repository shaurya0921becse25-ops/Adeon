import { CommunityProvider, useCommunity } from '../context/CommunityContext.jsx';
import CommunityFeed from '../components/CommunityFeed.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import PostDetailModal from '../components/PostDetailModal.jsx';
import '../styles/global.css';
import '../styles/community.css';

function CommunityContent() {
  const { toast } = useCommunity();

  return (
    <div className="community-page reddit-theme">
      {/* Main Community Area: Left Sidebar (Categories & Destinations) + Main Content Area */}
      <main className="community-main">
        <div className="community-main__inner">
          <CommunityFeed />
        </div>
      </main>

      {/* Modals */}
      <CreatePostModal />
      <PostDetailModal />

      {/* Toast Notification */}
      {toast && (
        <aside className="toast" role="status" aria-live="polite">
          <span>{toast}</span>
        </aside>
      )}
    </div>
  );
}

export default function Community() {
  return (
    <CommunityProvider>
      <CommunityContent />
    </CommunityProvider>
  );
}
