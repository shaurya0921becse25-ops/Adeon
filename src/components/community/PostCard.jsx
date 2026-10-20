import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Edit3, 
  Trash2, 
  Check 
} from 'lucide-react';
import { toggleHelpful, addComment, savePlace, deletePost, selectUserHelpfulVotes } from '../../store/communitySlice';
import { formatMonthYear, getFreshnessLabel } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../common/Avatar';
import Pill from '../common/Pill';
import StarRating from '../common/StarRating';
import Button from '../common/Button';
import './PostCard.css';

export default function PostCard({ post, onEdit, searchQuery = '' }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useToast();
  const helpfulVotes = useSelector(selectUserHelpfulVotes);

  const [expandedText, setExpandedText] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isHelpfulActive = Boolean(helpfulVotes[post.id]);
  const isOwner = user && (user.id === post.author?.id || user.name === post.author?.name);
  const freshness = getFreshnessLabel(post.monthVisited || post.createdAt);

  const handleToggleHelpful = () => {
    dispatch(toggleHelpful(post.id));
    if (!isHelpfulActive) {
      showToast('Marked as helpful', 'success');
    }
  };

  const handleSaveToTrip = () => {
    dispatch(
      savePlace({
        id: post.id,
        placeName: post.placeName,
        city: post.city,
        category: post.category,
        notes: post.tips?.[0] || post.title
      })
    );
    showToast(`Saved "${post.placeName}" to your trip plan!`, 'success');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'info');
      }).catch(() => {
        showToast(`Note link: ${url}`, 'info');
      });
    } else {
      showToast(`Note link: ${url}`, 'info');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: user?.name || 'Fellow Traveler',
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    dispatch(addComment({ postId: post.id, comment: newComment }));
    setCommentText('');
    showToast('Comment added', 'success');
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    showToast('Field note deleted', 'info');
  };

  // Helper to highlight matching search term
  const renderHighlighted = (text) => {
    if (!searchQuery || !searchQuery.trim() || !text) return text;
    const query = searchQuery.trim();
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <article id={post.id} className="field-note-card">
      {/* Top author row & destination pill */}
      <div className="note-card-header">
        <div className="note-author-info">
          <Avatar
            src={post.author?.avatar}
            name={post.author?.name}
            size="md"
            status={post.author?.isGuide ? 'guide' : null}
          />
          <div>
            <div className="note-author-name-row">
              <strong className="note-author-name">{post.author?.name}</strong>
              {post.author?.isGuide && (
                <span className="guide-ribbon" title="Verified Local Guide">
                  <Check size={11} strokeWidth={2.5} /> Local Guide
                </span>
              )}
              {!post.author?.isGuide && post.author?.badge && (
                <span className="visitor-badge">{post.author.badge}</span>
              )}
            </div>
            <small className="note-place-meta">{renderHighlighted(post.placeName)}</small>
          </div>
        </div>

        <div className="note-header-badges">
          <Pill variant="active">{post.city}</Pill>
          <Pill variant="sand">{post.category}</Pill>
        </div>
      </div>

      {/* Freshness label alert if applicable */}
      {freshness && (
        <div className={`freshness-badge freshness-badge--${freshness.type}`}>
          {freshness.type === 'recent' ? (
            <CheckCircle2 size={13} />
          ) : (
            <AlertTriangle size={13} />
          )}
          <span>{freshness.label} ({formatMonthYear(post.monthVisited)})</span>
        </div>
      )}

      {/* Title */}
      <h3 className="note-title">{renderHighlighted(post.title)}</h3>

      {/* Star rating */}
      <div className="note-rating-row">
        <StarRating value={post.rating} readOnly size="sm" showScore />
      </div>

      {/* Review content clamped to 4 lines */}
      <div className="note-review-body">
        <p className={`note-review-text ${expandedText ? 'is-expanded' : 'is-clamped'}`}>
          {renderHighlighted(post.review)}
        </p>
        {post.review?.length > 220 && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => setExpandedText(!expandedText)}
          >
            {expandedText ? 'Show less' : 'Read more...'}
          </button>
        )}
      </div>

      {/* Actionable Tips list */}
      {post.tips && post.tips.length > 0 && (
        <div className="note-tips-box">
          <span className="tips-box-heading">LOGISTICAL TIPS</span>
          <ul className="tips-list">
            {post.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Trip context row */}
      <div className="note-context-row">
        <span className="context-item">
          <Calendar size={13} /> Visited: <strong>{formatMonthYear(post.monthVisited)}</strong>
        </span>
        <span className="context-item">
          Budget: <strong>{post.budgetLevel}</strong>
        </span>
        <span className="context-item">
          Party: <strong>{post.travelerType}</strong>
        </span>
        {post.daysSpent && (
          <span className="context-item">
            Stayed: <strong>{post.daysSpent} days</strong>
          </span>
        )}
      </div>

      {/* Action row: Helpful, Comments, Save to trip, Share, Owner actions */}
      <div className="note-actions-row">
        <div className="note-actions-left">
          <button
            type="button"
            className={`note-action-btn ${isHelpfulActive ? 'is-active' : ''}`}
            onClick={handleToggleHelpful}
            aria-label={`Mark helpful. Currently ${post.helpfulCount || 0} helpful votes`}
          >
            <ThumbsUp size={15} />
            <span>Helpful ({post.helpfulCount || 0})</span>
          </button>

          <button
            type="button"
            className={`note-action-btn ${showComments ? 'is-active' : ''}`}
            onClick={() => setShowComments(!showComments)}
            aria-label="Toggle comments"
          >
            <MessageSquare size={15} />
            <span>Comments ({post.comments ? post.comments.length : 0})</span>
          </button>

          <button
            type="button"
            className="note-action-btn"
            onClick={handleSaveToTrip}
            title="Save to Itinerary Planner"
          >
            <Bookmark size={15} />
            <span>Save to trip</span>
          </button>

          <button
            type="button"
            className="note-action-btn"
            onClick={handleShare}
            title="Copy share link"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>

        {/* Owner edit/delete */}
        {isOwner && (
          <div className="note-owner-actions">
            <button
              type="button"
              className="owner-btn owner-btn--edit"
              onClick={() => onEdit(post)}
              title="Edit your post"
            >
              <Edit3 size={14} />
            </button>
            <button
              type="button"
              className="owner-btn owner-btn--delete"
              onClick={() => setConfirmDelete(true)}
              title="Delete your post"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation alert */}
      {confirmDelete && (
        <div className="delete-confirm-box">
          <p>Delete this Field Note? This action cannot be undone.</p>
          <div className="delete-confirm-btns">
            <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      )}

      {/* Expandable comment thread */}
      {showComments && (
        <div className="note-comments-thread">
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment-bubble">
                  <div className="comment-header">
                    <strong>{comment.author}</strong>
                    {comment.isGuide && <span className="guide-chip">Guide</span>}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments-yet">No comments yet. Have a question about this stop?</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-input-form">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a polite clarification or question..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={240}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!commentText.trim()}
              rightIcon={<Send size={13} />}
            >
              Reply
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
