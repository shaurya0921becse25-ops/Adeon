import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  MapPin,
  Lightbulb,
  DollarSign,
  UserPlus,
  Check,
  Send,
  Heart,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { CATEGORIES, AVATAR_COLORS } from '../data/samplePosts.js';
import '../styles/community.css';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const now = new Date();
    const diffHours = Math.round((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function PostCard({ post }) {
  const {
    handleToggleVote,
    handleToggleSave,
    handleAddComment,
    handleToggleCommentLike,
    handleToggleFollow,
    followedUsers,
    handleSelectTag,
    showToast,
    setDetailPost,
    handleDeletePost,
  } = useCommunity();

  const [expandedComments, setExpandedComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFullText, setIsFullText] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen]);

  // Determine post ownership strictly
  const isOwner = Boolean(
    post.isOwner ||
    post.author === 'You' ||
    (typeof post.author === 'string' && post.author.toLowerCase() === 'you') ||
    (typeof post.id === 'string' && post.id.startsWith('user-'))
  );

  const categoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.id === post.category);
  }, [post.category]);

  const avatarBg = useMemo(() => {
    let hash = 0;
    const authorName = post.author || 'Traveller';
    for (let i = 0; i < authorName.length; i++) {
      hash = authorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }, [post.author]);

  const initials = post.authorInitials || (post.author ? post.author.slice(0, 2).toUpperCase() : 'TR');
  const isFollowed = followedUsers.has(post.author);
  const commentsList = post.comments || [];

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! Share it with your travel buddies 🔗');
    } else {
      showToast('Story link ready to share! 🔗');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    handleAddComment(post.id, {
      text: commentText.trim(),
      author: 'You (Explorer)',
    });
    setCommentText('');
    setExpandedComments(true);
  };

  const handleReplyClick = (authorName) => {
    setCommentText(`@${authorName} `);
    setExpandedComments(true);
  };

  const isLongDescription = post.description && post.description.length > 280;

  return (
    <article
      className={`reddit-post${post.userVote ? ` voted-${post.userVote}` : ''}`}
      aria-labelledby={`post-title-${post.id}`}
    >
      {/* =========================================
          LEFT KARMA / VOTE GUTTER (Reddit style)
         ========================================= */}
      <div className="reddit-post__vote-gutter" aria-label="Vote on this post">
        <button
          type="button"
          className={`reddit-post__vote-btn upvote${post.userVote === 'up' ? ' active' : ''}`}
          onClick={() => handleToggleVote(post.id, 'up')}
          aria-label="Upvote this post"
          title="Upvote (Helpful / Authentic)"
        >
          <ArrowBigUp size={24} fill={post.userVote === 'up' ? 'currentColor' : 'none'} />
        </button>

        <span className={`reddit-post__score${post.userVote ? ` ${post.userVote}` : ''}`}>
          {post.likes}
        </span>

        <button
          type="button"
          className={`reddit-post__vote-btn downvote${post.userVote === 'down' ? ' active' : ''}`}
          onClick={() => handleToggleVote(post.id, 'down')}
          aria-label="Downvote this post"
          title="Downvote"
        >
          <ArrowBigDown size={24} fill={post.userVote === 'down' ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* =========================================
          RIGHT MAIN POST CONTENT
         ========================================= */}
      <div className="reddit-post__content">
        {/* Post Meta / Header */}
        <div className="reddit-post__header">
          <div className="reddit-post__author-row">
            <div
              className="reddit-post__avatar"
              style={{ backgroundColor: avatarBg }}
              aria-hidden="true"
            >
              {initials}
            </div>

            <div className="reddit-post__meta-text">
              <div className="reddit-post__meta-top">
                <span className="reddit-post__author-handle">
                  u/{post.author.replace(/\s+/g, '_').toLowerCase()}
                </span>

                {post.authorBadge && (
                  <span className="reddit-post__author-badge">
                    {post.authorBadge}
                  </span>
                )}

                {post.author !== 'You' && (
                  <button
                    type="button"
                    className={`reddit-post__follow-btn${isFollowed ? ' followed' : ''}`}
                    onClick={() => handleToggleFollow(post.author)}
                    aria-label={isFollowed ? `Unfollow ${post.author}` : `Connect with ${post.author}`}
                    title={isFollowed ? 'Connected' : 'Connect with traveler'}
                  >
                    {isFollowed ? (
                      <>
                        <Check size={12} /> Connected
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} /> Connect
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="reddit-post__meta-bottom">
                <span className="reddit-post__time">{formatDate(post.createdAt)}</span>
                <span className="reddit-post__meta-dot">•</span>
                <span className="reddit-post__location">
                  <MapPin size={12} aria-hidden="true" />
                  {post.destination}
                  {post.state ? `, ${post.state}` : ''}
                </span>
                {categoryObj && (
                  <>
                    <span className="reddit-post__meta-dot">•</span>
                    <span className="reddit-post__category-flair">
                      {categoryObj.emoji} {categoryObj.label}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="reddit-post__header-right">
            {/* Quick Save Bookmark in Header */}
            <button
              type="button"
              className={`reddit-post__quick-save${post.isSaved ? ' saved' : ''}`}
              onClick={() => handleToggleSave(post.id)}
              aria-label={post.isSaved ? 'Remove from saved' : 'Save story'}
              title={post.isSaved ? 'Saved to bookmarks' : 'Save story'}
            >
              <Bookmark size={17} fill={post.isSaved ? 'currentColor' : 'none'} />
            </button>

            {/* Owner Actions Menu (Only for current user's posts) */}
            {isOwner && (
              <div className="reddit-post__menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  id={`post-menu-btn-${post.id}`}
                  className="reddit-post__menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen((prev) => !prev);
                  }}
                  aria-label="Story actions"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  title="Story actions"
                >
                  <MoreHorizontal size={18} />
                </button>

                {isMenuOpen && (
                  <div
                    className="reddit-post__menu-dropdown"
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      id={`delete-btn-${post.id}`}
                      className="reddit-post__menu-item danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setShowDeleteConfirm(true);
                      }}
                      role="menuitem"
                    >
                      <Trash2 size={14} />
                      <span>Delete Story</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Title */}
        <h2
          id={`post-title-${post.id}`}
          className="reddit-post__title"
          onClick={() => setDetailPost(post)}
        >
          {post.title}
        </h2>

        {/* Post Text Narrative */}
        <div className="reddit-post__body">
          <p className="reddit-post__description">
            {isLongDescription && !isFullText
              ? `${post.description.slice(0, 260)}...`
              : post.description}
          </p>
          {isLongDescription && (
            <button
              type="button"
              className="reddit-post__expand-btn"
              onClick={() => setIsFullText((v) => !v)}
            >
              {isFullText ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>Read full story <ChevronDown size={14} /></>
              )}
            </button>
          )}
        </div>

        {/* Local Tip Box (Highlight) */}
        {post.tip && (
          <div className="reddit-post__tip-box">
            <div className="reddit-post__tip-header">
              <Lightbulb size={15} aria-hidden="true" />
              <span>Insider Travel Tip</span>
            </div>
            <p className="reddit-post__tip-text">{post.tip}</p>
          </div>
        )}

        {/* Budget Breakdown */}
        {post.budget && (
          <div className="reddit-post__budget-pill">
            <DollarSign size={14} aria-hidden="true" />
            <span>Budget: <strong>{post.budget}</strong></span>
          </div>
        )}

        {/* Embedded Photo Media */}
        {post.imageUrl && (
          <div
            className="reddit-post__media-wrap"
            onClick={() => setDetailPost(post)}
            role="button"
            tabIndex={0}
            aria-label="Click to view full photo and story details"
            onKeyDown={(e) => {
              if (e.key === 'Enter') setDetailPost(post);
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Tags / Flairs */}
        {post.tags && post.tags.length > 0 && (
          <div className="reddit-post__tags" aria-label="Post tags">
            {post.tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                className="reddit-post__tag-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTag(tag);
                }}
                title={`Filter by #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* =========================================
            BOTTOM ACTION BAR (Reddit style)
           ========================================= */}
        <div className="reddit-post__actions">
          {/* Mobile Vote Pill (Visible on small screens) */}
          <div className="reddit-post__mobile-vote" aria-label="Mobile voting">
            <button
              type="button"
              className={`mobile-vote-btn up${post.userVote === 'up' ? ' active' : ''}`}
              onClick={() => handleToggleVote(post.id, 'up')}
              aria-label="Upvote"
            >
              <ArrowBigUp size={18} fill={post.userVote === 'up' ? 'currentColor' : 'none'} />
            </button>
            <span className="mobile-vote-score">{post.likes}</span>
            <button
              type="button"
              className={`mobile-vote-btn down${post.userVote === 'down' ? ' active' : ''}`}
              onClick={() => handleToggleVote(post.id, 'down')}
              aria-label="Downvote"
            >
              <ArrowBigDown size={18} fill={post.userVote === 'down' ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Comments Toggle Button */}
          <button
            type="button"
            className={`reddit-post__action-btn${expandedComments ? ' active' : ''}`}
            onClick={() => setExpandedComments((prev) => !prev)}
            aria-expanded={expandedComments}
            aria-label={`View ${commentsList.length} comments`}
          >
            <MessageSquare size={16} />
            <span>{commentsList.length} {commentsList.length === 1 ? 'Comment' : 'Comments'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="reddit-post__action-btn"
            onClick={handleShare}
            aria-label="Share post link"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            className={`reddit-post__action-btn${post.isSaved ? ' saved' : ''}`}
            onClick={() => handleToggleSave(post.id)}
            aria-label={post.isSaved ? 'Saved' : 'Save post'}
          >
            <Bookmark size={16} fill={post.isSaved ? 'currentColor' : 'none'} />
            <span>{post.isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Ask Author Shortcut */}
          {post.author !== 'You' && (
            <button
              type="button"
              className="reddit-post__action-btn ask-btn"
              onClick={() => handleReplyClick(post.author)}
              aria-label={`Ask ${post.author} a question`}
            >
              💬 Ask {post.author.split(' ')[0]}
            </button>
          )}
        </div>

        {/* =========================================
            INLINE DISCUSSION / COMMENTS THREAD
           ========================================= */}
        {expandedComments && (
          <div className="reddit-post__discussion" aria-label="Community discussion thread">
            {/* Comment Composer */}
            <form onSubmit={handleCommentSubmit} className="reddit-post__comment-form">
              <div className="reddit-post__comment-input-wrap">
                <textarea
                  className="reddit-post__comment-input"
                  placeholder={`Join the conversation with u/${post.author.replace(/\s+/g, '_').toLowerCase()}...`}
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  aria-label="Write a comment or question"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm reddit-post__comment-submit"
                  disabled={!commentText.trim()}
                >
                  <Send size={14} /> Reply
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="reddit-post__comments-list">
              {commentsList.length === 0 ? (
                <div className="reddit-post__no-comments">
                  <span>🧭 Be the first to ask a question or leave a tip for fellow travelers!</span>
                </div>
              ) : (
                commentsList.map((c) => (
                  <div key={c.id} className="comment-thread">
                    <div
                      className="comment-avatar"
                      style={{ backgroundColor: c.avatarBg || '#7C5C3E' }}
                      aria-hidden="true"
                    >
                      {c.authorInitials || c.author.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{c.author}</span>
                        {c.isAuthor && (
                          <span className="comment-author-badge">Author</span>
                        )}
                        <span className="comment-time">{c.time}</span>
                      </div>

                      <p className="comment-text">{c.text}</p>

                      <div className="comment-actions">
                        <button
                          type="button"
                          className={`comment-like-btn${c.isLiked ? ' active' : ''}`}
                          onClick={() => handleToggleCommentLike(c.id)}
                          aria-label={c.isLiked ? 'Liked comment' : 'Upvote comment'}
                        >
                          <Heart size={13} fill={c.isLiked ? 'currentColor' : 'none'} />
                          <span>{c.likes || 0}</span>
                        </button>

                        <button
                          type="button"
                          className="comment-reply-btn"
                          onClick={() => handleReplyClick(c.author)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Modal for Post Deletion */}
      {showDeleteConfirm && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-confirm-title-${post.id}`}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="confirm-delete-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-delete-dialog__header">
              <div className="confirm-delete-dialog__icon-wrap">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 id={`delete-confirm-title-${post.id}`} className="confirm-delete-dialog__title">
                  Delete Travel Story?
                </h3>
                <p className="confirm-delete-dialog__subtitle">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="confirm-delete-dialog__content">
              <p>
                Are you sure you want to remove <strong>"{post.title}"</strong> from the Abeon community?
                This story and all of its comments will be permanently deleted.
              </p>
            </div>

            <div className="confirm-delete-dialog__actions">
              <button
                type="button"
                id={`cancel-delete-btn-${post.id}`}
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                id={`confirm-delete-btn-${post.id}`}
                className="btn btn-danger"
                onClick={() => {
                  handleDeletePost(post.id);
                  setShowDeleteConfirm(false);
                }}
              >
                <Trash2 size={15} /> Yes, Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
