import { useState, useEffect, useMemo } from 'react';
import {
  X,
  MapPin,
  Bookmark,
  ArrowBigUp,
  ArrowBigDown,
  UserPlus,
  Check,
  Send,
  Heart,
  MessageSquare,
  DollarSign,
  Lightbulb,
  Trash2,
} from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { CATEGORIES } from '../data/samplePosts.js';
import '../styles/community.css';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function PostDetailModal() {
  const {
    detailPost,
    setDetailPost,
    handleToggleVote,
    handleToggleSave,
    handleAddComment,
    handleToggleCommentLike,
    handleToggleFollow,
    followedUsers,
    handleDeletePost,
  } = useCommunity();

  const [commentInput, setCommentInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Close on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && detailPost) {
        setDetailPost(null);
      }
    };
    if (detailPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [detailPost, setDetailPost]);

  const categoryObj = useMemo(() => {
    if (!detailPost) return null;
    return CATEGORIES.find((c) => c.id === detailPost.category);
  }, [detailPost]);

  if (!detailPost) return null;

  const isFollowed = followedUsers.has(detailPost.author);
  const commentsList = detailPost.comments || [];

  const isOwner = Boolean(
    detailPost.isOwner ||
    detailPost.author === 'You' ||
    (typeof detailPost.author === 'string' && detailPost.author.toLowerCase() === 'you') ||
    (typeof detailPost.id === 'string' && detailPost.id.startsWith('user-'))
  );

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    handleAddComment(detailPost.id, {
      text: commentInput.trim(),
      author: 'You (Explorer)',
    });
    setCommentInput('');
  };

  const handleReplyTo = (authorName) => {
    setCommentInput(`@${authorName} `);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setDetailPost(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div
        className="modal-box details-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', backgroundColor: '#FFFFFF', color: '#2C221D' }}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          className="btn-icon details-modal__close"
          onClick={(e) => {
            e.stopPropagation();
            setDetailPost(null);
          }}
          aria-label="Close story details"
        >
          <X size={20} />
        </button>

        {/* Hero image or placeholder */}
        {detailPost.imageUrl && (
          <div className="details-modal__image">
            <img
              src={detailPost.imageUrl}
              alt={detailPost.title}
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content area */}
        <div className="details-modal__content" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Top Metadata Chips & Voting */}
          <div className="details-modal__top-bar">
            <div className="details-modal__vote-pill">
              <button
                type="button"
                className={`modal-vote-btn up${detailPost.userVote === 'up' ? ' active' : ''}`}
                onClick={() => handleToggleVote(detailPost.id, 'up')}
                aria-label="Upvote"
              >
                <ArrowBigUp size={20} fill={detailPost.userVote === 'up' ? 'currentColor' : 'none'} />
              </button>
              <span className="modal-vote-score">{detailPost.likes}</span>
              <button
                type="button"
                className={`modal-vote-btn down${detailPost.userVote === 'down' ? ' active' : ''}`}
                onClick={() => handleToggleVote(detailPost.id, 'down')}
                aria-label="Downvote"
              >
                <ArrowBigDown size={20} fill={detailPost.userVote === 'down' ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="details-modal__meta-chips">
              {categoryObj && (
                <span className="flair-pill active" style={{ cursor: 'default' }}>
                  <span>{categoryObj.emoji}</span>
                  <span>{categoryObj.label}</span>
                </span>
              )}

              <div className="post-location-tag">
                <MapPin size={14} aria-hidden="true" />
                <span>
                  {detailPost.destination}
                  {detailPost.state ? `, ${detailPost.state}` : ''}
                </span>
              </div>

              {detailPost.budget && (
                <div className="post-budget-tag">
                  <DollarSign size={14} aria-hidden="true" />
                  <span>{detailPost.budget}</span>
                </div>
              )}
            </div>

            <div className="details-modal__top-actions">
              <button
                type="button"
                className={`btn btn-secondary btn-sm${detailPost.isSaved ? ' active' : ''}`}
                onClick={() => handleToggleSave(detailPost.id)}
                aria-label={detailPost.isSaved ? 'Saved' : 'Save'}
              >
                <Bookmark size={15} fill={detailPost.isSaved ? 'currentColor' : 'none'} />
                <span>{detailPost.isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>

              {isOwner && (
                <button
                  type="button"
                  id={`detail-delete-btn-${detailPost.id}`}
                  className="btn btn-secondary btn-sm btn-delete-post"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete this story"
                >
                  <Trash2 size={14} />
                  <span>Delete Story</span>
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 id="detail-modal-title" className="details-modal__title">
            {detailPost.title}
          </h1>

          {/* Author Header Row */}
          <div className="details-modal__author-row">
            <div className="post-card__author">
              <div>
                <div className="details-modal__author-name">
                  <strong>{detailPost.author}</strong>
                  <span className="author-handle">
                    u/{detailPost.author.replace(/\s+/g, '_').toLowerCase()}
                  </span>
                  {detailPost.authorBadge && (
                    <span className="author-badge-pill">{detailPost.authorBadge}</span>
                  )}
                </div>
                <div className="post-card__author-date">
                  Shared on {formatDate(detailPost.createdAt)}
                </div>
              </div>
            </div>

            {detailPost.author !== 'You' && (
              <button
                type="button"
                className={`btn btn-secondary btn-sm${isFollowed ? ' active' : ''}`}
                onClick={() => handleToggleFollow(detailPost.author)}
              >
                {isFollowed ? (
                  <>
                    <Check size={14} /> Connected
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Connect with Traveler
                  </>
                )}
              </button>
            )}
          </div>

          {/* Full Description */}
          <div className="details-modal__desc">
            {detailPost.description}
          </div>

          {/* Insider Tip Box */}
          {detailPost.tip && (
            <div className="details-modal__tip-box">
              <div className="details-modal__tip-label">
                <Lightbulb size={16} /> Insider Travel Tip
              </div>
              <p className="details-modal__tip-text">{detailPost.tip}</p>
            </div>
          )}

          {/* Tags */}
          {detailPost.tags && detailPost.tags.length > 0 && (
            <div className="details-modal__tags">
              {detailPost.tags.map((tag, idx) => (
                <span key={idx} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* =========================================
              DISCUSSION / COMMENTS SECTION
             ========================================= */}
          <div className="details-modal__comments-section">
            <div className="comments-section__header">
              <MessageSquare size={18} />
              <h3>Community Discussion ({commentsList.length})</h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="details-modal__comment-form">
              <textarea
                className="details-modal__comment-input"
                placeholder={`Ask ${detailPost.author.split(' ')[0]} for advice or leave a tip...`}
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <div className="details-modal__comment-footer">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!commentInput.trim()}
                >
                  <Send size={14} /> Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="details-modal__comments-list">
              {commentsList.map((c) => (
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
                        aria-label={c.isLiked ? 'Liked' : 'Like'}
                      >
                        <Heart size={13} fill={c.isLiked ? 'currentColor' : 'none'} />
                        <span>{c.likes || 0}</span>
                      </button>

                      <button
                        type="button"
                        className="comment-reply-btn"
                        onClick={() => handleReplyTo(c.author)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation Dialog for Modal Post Deletion */}
        {showDeleteConfirm && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-delete-title"
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
                  <h3 id="modal-delete-title" className="confirm-delete-dialog__title">
                    Delete Travel Story?
                  </h3>
                  <p className="confirm-delete-dialog__subtitle">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="confirm-delete-dialog__content">
                <p>
                  Are you sure you want to remove <strong>"{detailPost.title}"</strong> from the Abeon community?
                  This story will be permanently removed.
                </p>
              </div>

              <div className="confirm-delete-dialog__actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeletePost(detailPost.id);
                    setShowDeleteConfirm(false);
                  }}
                >
                  <Trash2 size={15} /> Yes, Delete Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
