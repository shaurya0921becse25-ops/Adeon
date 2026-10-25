import { Image, Lightbulb, DollarSign, HelpCircle, Edit3 } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

export default function CreatePostQuickBox() {
  const { setCreateModalOpen } = useCommunity();

  return (
    <div className="quick-post-box" onClick={() => setCreateModalOpen(true)}>
      <div className="quick-post-box__top">
        <div className="quick-post-box__avatar" aria-hidden="true">
          <span>🎒</span>
        </div>
        <div
          className="quick-post-box__input-mock"
          role="button"
          tabIndex={0}
          aria-label="Create a post: share your journey or ask travel advice"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setCreateModalOpen(true);
            }
          }}
        >
          <span>Share an adventure, secret viewpoint, or ask for local advice...</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm quick-post-box__submit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreateModalOpen(true);
          }}
        >
          <Edit3 size={15} /> Post
        </button>
      </div>

      <div className="quick-post-box__actions">
        <button
          type="button"
          className="quick-post-box__action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreateModalOpen(true);
          }}
        >
          <Image size={17} className="icon-photo" />
          <span>Photo Story</span>
        </button>

        <button
          type="button"
          className="quick-post-box__action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreateModalOpen(true);
          }}
        >
          <Lightbulb size={17} className="icon-tip" />
          <span>Insider Tip</span>
        </button>

        <button
          type="button"
          className="quick-post-box__action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreateModalOpen(true);
          }}
        >
          <DollarSign size={17} className="icon-budget" />
          <span>Budget Breakdown</span>
        </button>

        <button
          type="button"
          className="quick-post-box__action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreateModalOpen(true);
          }}
        >
          <HelpCircle size={17} className="icon-question" />
          <span>Ask Community</span>
        </button>
      </div>
    </div>
  );
}
