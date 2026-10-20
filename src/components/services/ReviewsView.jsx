import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star, Check, AlertCircle, Edit2, Trash2, Camera, MessageSquare,
  ThumbsUp, Sparkles, X, ChevronRight
} from 'lucide-react';
import {
  selectReviews,
  selectBookings,
  selectAllServices,
  selectGuides,
  addReview,
  editReview,
  deleteReview,
  voteHelpfulReview
} from '../../store/servicesSlice';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import './ReviewsView.css';

const OPTIONAL_TAGS = [
  'on time',
  'good value',
  'local knowledge',
  'patient',
  'hidden gems',
  'great photos',
  'family friendly'
];

export default function ReviewsView({ prefilledBooking = null, onExploreServices }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useToast();

  const reviews = useSelector(selectReviews);
  const bookings = useSelector(selectBookings);
  const services = useSelector(selectAllServices);
  const guides = useSelector(selectGuides);

  // Completed bookings available for review
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  // Active form state
  const [isFormOpen, setIsFormOpen] = useState(Boolean(prefilledBooking));
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState(
    prefilledBooking?.serviceId || completedBookings[0]?.serviceId || ''
  );
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['local knowledge']);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Blur validation state
  const [touched, setTouched] = useState({ rating: false, text: false });
  const [errors, setErrors] = useState({});

  const currentUserAuthorName = user?.name || 'Aarav Mehta';

  const validate = (curRating = rating, curText = text) => {
    const errs = {};
    if (!curRating || curRating < 1) {
      errs.rating = 'A star rating is required.';
    }
    if (!curText || curText.trim().length < 20) {
      errs.text = `Review must be at least 20 characters (current: ${curText.trim().length}/20).`;
    } else if (curText.length > 500) {
      errs.text = 'Review cannot exceed 500 characters.';
    }
    return errs;
  };

  const isFormValid = rating >= 1 && text.trim().length >= 20 && text.length <= 500;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleStartReview = (b) => {
    setSelectedServiceId(b.serviceId);
    setEditingReviewId(null);
    setRating(5);
    setText('');
    setSelectedTags(['local knowledge']);
    setPhotoPreview(null);
    setTouched({ rating: false, text: false });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id);
    setSelectedServiceId(rev.serviceId);
    setRating(rev.rating);
    setText(rev.text);
    setSelectedTags(rev.tags || []);
    setPhotoPreview(rev.photo || null);
    setTouched({ rating: false, text: false });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleDelete = (revId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(revId));
      showToast('Review deleted and service rating updated', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentErrors = validate();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setTouched({ rating: true, text: true });
      return;
    }

    if (editingReviewId) {
      // Edit existing review
      dispatch(
        editReview({
          id: editingReviewId,
          rating,
          text: text.trim(),
          tags: selectedTags,
          photo: photoPreview
        })
      );
      showToast('Review updated! Service rating recalculated.', 'success');
    } else {
      // Add new review
      const newRev = {
        id: `rev-${Date.now()}`,
        serviceId: selectedServiceId,
        author: currentUserAuthorName,
        rating,
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
        helpful: 0,
        tags: selectedTags,
        photo: photoPreview
      };
      dispatch(addReview(newRev));
      showToast('Review published! Service rating updated immediately.', 'success');
    }

    setIsFormOpen(false);
    setEditingReviewId(null);
    setText('');
  };

  // Find target service
  const targetService = services.find((s) => s.id === selectedServiceId);
  const targetGuide = guides.find((g) => g.id === targetService?.guideId);

  return (
    <div className="reviews-view-container">
      {/* Policy Notice */}
      <div className="review-policy-banner">
        <Sparkles size={16} />
        <div>
          <strong>Verified Reviews Policy</strong>
          <p>
            Only travelers with completed service bookings can submit reviews. This keeps ABEON field notes honest and unpolluted by fake feedback.
          </p>
        </div>
      </div>

      {/* Unreviewed Completed Bookings Prompt */}
      {completedBookings.length > 0 && !isFormOpen && (
        <div className="pending-review-prompt-card">
          <div className="prompt-content">
            <span className="prompt-tag">COMPLETED SERVICE READY FOR REVIEW</span>
            <h4>
              Share your honest notes about{' '}
              {completedBookings[0].serviceTitle}
            </h4>
            <p>
              Helped by {completedBookings[0].guideName} in {completedBookings[0].city} on{' '}
              {completedBookings[0].date}.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={15} />}
            onClick={() => handleStartReview(completedBookings[0])}
          >
            Write review
          </Button>
        </div>
      )}

      {/* Review Form Drawer / Card */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="review-composer-card">
          <div className="composer-header">
            <div>
              <h3 className="composer-title">
                {editingReviewId ? 'Edit Your Review' : 'Write a Verified Review'}
              </h3>
              <span className="composer-sub">
                Reviewing: <strong>{targetService?.title || 'Selected Service'}</strong> by{' '}
                {targetGuide?.name || 'Guide'}
              </span>
            </div>
            <button
              type="button"
              className="composer-close-btn"
              onClick={() => setIsFormOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="composer-fields">
            {/* Star Rating */}
            <div className="review-form-field">
              <label className="field-label">
                <span>Rating (Required)</span>
                {touched.rating && errors.rating && (
                  <span className="field-err-msg">{errors.rating}</span>
                )}
              </label>
              <div
                className="interactive-stars-row"
                onBlur={() => handleBlur('rating')}
                tabIndex={0}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`star-select-btn ${rating >= num ? 'is-lit' : ''}`}
                    onClick={() => {
                      setRating(num);
                      if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                    }}
                    aria-label={`${num} stars`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
                <span className="rating-num-label tabular-nums">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            {/* Review Text (20 - 500 chars with live counter) */}
            <div className="review-form-field">
              <div className="field-label-row">
                <label htmlFor="review-text" className="field-label">
                  Your Honest Experience (20–500 chars)
                </label>
                <span
                  className={`live-counter tabular-nums ${
                    text.length < 20 || text.length > 500 ? 'is-warning' : 'is-ok'
                  }`}
                >
                  {text.length}/500 chars {text.length < 20 ? `(min 20, ${20 - text.length} more)` : ''}
                </span>
              </div>
              <textarea
                id="review-text"
                rows={4}
                className={`review-textarea ${touched.text && errors.text ? 'is-invalid' : ''}`}
                placeholder="Mention pacing, crowd management, meeting point clarity, and whether you felt rushed."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (errors.text && e.target.value.trim().length >= 20) {
                    setErrors((prev) => ({ ...prev, text: '' }));
                  }
                }}
                onBlur={() => handleBlur('text')}
              />
              {touched.text && errors.text && (
                <span className="field-err-msg">{errors.text}</span>
              )}
            </div>

            {/* Optional Pebble Tags */}
            <div className="review-form-field">
              <label className="field-label">Optional Quick Tags</label>
              <div className="tags-pebble-row">
                {OPTIONAL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-pebble-btn ${
                      selectedTags.includes(tag) ? 'is-selected' : ''
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Photo Attachment */}
            <div className="review-form-field">
              <label className="field-label">Optional Photo from Field</label>
              <div className="photo-upload-row">
                <label className="photo-upload-btn">
                  <Camera size={16} />
                  <span>Attach snapshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                {photoPreview && (
                  <div className="preview-wrap">
                    <img src={photoPreview} alt="Upload preview" className="preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => setPhotoPreview(null)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="composer-footer">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isFormValid}
            >
              {editingReviewId ? 'Save Changes' : 'Publish Review'}
            </Button>
          </div>
        </form>
      )}

      {/* Published Reviews Stream */}
      <div className="reviews-published-stream">
        <h3 className="published-stream-title">Your Reviews & Community Feedback</h3>

        <div className="reviews-cards-grid">
          {reviews.map((r) => {
            const isUserReview = r.author === currentUserAuthorName || r.author === 'Priya Narang';
            const svc = services.find((s) => s.id === r.serviceId);

            return (
              <div key={r.id} className={`traveler-review-card ${isUserReview ? 'is-own-review' : ''}`}>
                <div className="rev-card-top">
                  <div>
                    <div className="rev-author-row">
                      <strong className="rev-author">{r.author}</strong>
                      {isUserReview && (
                        <span className="own-review-pill">your review</span>
                      )}
                    </div>
                    {svc && (
                      <span className="rev-service-link">{svc.title} &bull; {svc.city}</span>
                    )}
                  </div>

                  <div className="rev-rating-stars">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} className="star-filled" fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="rev-text">{r.text}</p>

                {r.photo && (
                  <div className="rev-attached-photo">
                    <img src={r.photo} alt="Traveler review snap" />
                  </div>
                )}

                {r.tags && r.tags.length > 0 && (
                  <div className="rev-tags-list">
                    {r.tags.map((t) => (
                      <span key={t} className="rev-tag-item">#{t}</span>
                    ))}
                  </div>
                )}

                <div className="rev-card-footer">
                  <span className="rev-date tabular-nums">{r.date}</span>

                  <div className="rev-actions-right">
                    {isUserReview ? (
                      <>
                        <button
                          type="button"
                          className="rev-action-link"
                          onClick={() => handleStartEdit(r)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="rev-action-link is-danger"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="helpful-count-btn"
                        onClick={() => dispatch(voteHelpfulReview(r.id))}
                      >
                        <ThumbsUp size={12} />
                        <span>Helpful ({r.helpful || 0})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
