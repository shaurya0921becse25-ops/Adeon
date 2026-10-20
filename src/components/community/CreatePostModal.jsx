import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { addPost, editPost } from '../../store/communitySlice';
import { PILOT_CITY_NAMES } from '../../data/destinations';
import { CATEGORIES, TRAVELER_TYPES, BUDGET_LEVELS } from '../../data/posts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormField from '../common/FormField';
import StarRating from '../common/StarRating';
import './CreatePostModal.css';

export default function CreatePostModal({
  isOpen,
  onClose,
  editTarget = null // if editing existing post
}) {
  const dispatch = useDispatch();
  const { user, userRole } = useAuth();
  const { showToast } = useToast();

  const isEdit = Boolean(editTarget);

  // Form values
  const [city, setCity] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(5);
  const [monthVisited, setMonthVisited] = useState('');
  const [travelerType, setTravelerType] = useState('Solo');
  const [budgetLevel, setBudgetLevel] = useState('₹₹');
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [tips, setTips] = useState(['']);

  // Validation errors & touched states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Field refs to focus first invalid on submit
  const cityRef = useRef(null);
  const placeNameRef = useRef(null);
  const categoryRef = useRef(null);
  const monthVisitedRef = useRef(null);
  const titleRef = useRef(null);
  const reviewRef = useRef(null);

  const fieldRefs = {
    city: cityRef,
    placeName: placeNameRef,
    category: categoryRef,
    monthVisited: monthVisitedRef,
    title: titleRef,
    review: reviewRef
  };

  // Populate fields if editing
  useEffect(() => {
    if (editTarget) {
      setCity(editTarget.city || '');
      setPlaceName(editTarget.placeName || '');
      setCategory(editTarget.category || '');
      setRating(editTarget.rating || 5);
      setMonthVisited(editTarget.monthVisited || '');
      setTravelerType(editTarget.travelerType || 'Solo');
      setBudgetLevel(editTarget.budgetLevel || '₹₹');
      setTitle(editTarget.title || '');
      setReview(editTarget.review || '');
      setTips(editTarget.tips && editTarget.tips.length > 0 ? editTarget.tips : ['']);
    } else {
      // Reset
      setCity('Shimla');
      setPlaceName('');
      setCategory('Transport');
      setRating(5);
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setMonthVisited(currentMonth);
      setTravelerType('Solo');
      setBudgetLevel('₹₹');
      setTitle('');
      setReview('');
      setTips(['']);
    }
    setErrors({});
    setTouched({});
  }, [editTarget, isOpen]);

  // Validation function
  const validateField = (fieldName, value) => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    switch (fieldName) {
      case 'city':
        if (!trimmed) return 'Please select a pilot destination.';
        return null;

      case 'placeName':
        if (!trimmed) return 'Place or attraction name is required.';
        if (trimmed.length < 3) return 'Place name must be at least 3 characters.';
        if (trimmed.length > 60) return 'Place name cannot exceed 60 characters.';
        return null;

      case 'category':
        if (!trimmed) return 'Please select a category.';
        return null;

      case 'monthVisited':
        if (!trimmed) return 'Please select when you visited.';
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        if (trimmed > currentMonth) return 'Visit month cannot be in the future.';
        return null;

      case 'title':
        if (!trimmed) return 'A descriptive summary title is required.';
        if (trimmed.length < 8) return 'Title must be at least 8 characters (be specific).';
        if (trimmed.length > 80) return 'Title cannot exceed 80 characters.';
        if (/http(s)?:\/\/|www\./i.test(trimmed)) return 'Links and URLs are not permitted in titles.';
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 10) return 'Please avoid all-caps titles.';
        return null;

      case 'review':
        if (!trimmed) return 'Review details are required.';
        if (trimmed.length < 20) return 'Please provide more detail (minimum 20 characters).';
        if (trimmed.length > 800) return 'Review cannot exceed 800 characters.';
        if (/(.)\1{5,}/.test(trimmed)) return 'Spam check: Please avoid repeated characters.';
        if (/http(s)?:\/\/|www\./i.test(trimmed)) return 'Commercial URLs are not permitted in Field Notes.';
        return null;

      default:
        return null;
    }
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleAddTip = () => {
    if (tips.length < 3) {
      setTips([...tips, '']);
    }
  };

  const handleRemoveTip = (index) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handleTipChange = (index, value) => {
    const updated = [...tips];
    updated[index] = value;
    setTips(updated);
  };

  // Run all validations
  const validateForm = () => {
    const newErrors = {
      city: validateField('city', city),
      placeName: validateField('placeName', placeName),
      category: validateField('category', category),
      monthVisited: validateField('monthVisited', monthVisited),
      title: validateField('title', title),
      review: validateField('review', review)
    };

    setErrors(newErrors);
    setTouched({
      city: true,
      placeName: true,
      category: true,
      monthVisited: true,
      title: true,
      review: true
    });

    const invalidKey = Object.keys(newErrors).find((k) => newErrors[k] !== null);
    if (invalidKey && fieldRefs[invalidKey]?.current) {
      fieldRefs[invalidKey].current.focus();
      return false;
    }
    return !invalidKey;
  };

  const isFormValid =
    !validateField('city', city) &&
    !validateField('placeName', placeName) &&
    !validateField('category', category) &&
    !validateField('monthVisited', monthVisited) &&
    !validateField('title', title) &&
    !validateField('review', review);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const filteredTips = tips.map((t) => t.trim()).filter(Boolean);

    if (isEdit) {
      dispatch(
        editPost({
          id: editTarget.id,
          city,
          placeName: placeName.trim(),
          category,
          rating,
          monthVisited,
          travelerType,
          budgetLevel,
          title: title.trim(),
          review: review.trim(),
          tips: filteredTips
        })
      );
      showToast('Field note updated', 'success');
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        city,
        placeName: placeName.trim(),
        category,
        rating,
        monthVisited,
        travelerType,
        budgetLevel,
        title: title.trim(),
        review: review.trim(),
        tips: filteredTips,
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
        author: {
          id: user?.id || 'guest',
          name: user?.name || 'Fellow Traveler',
          badge: userRole === 'guide' ? 'Local Guide' : 'Traveler',
          isGuide: userRole === 'guide',
          avatar: user?.avatar || ''
        },
        comments: []
      };
      dispatch(addPost(newPost));
      showToast('Field note published!', 'success');
    }

    onClose();
  };

  const reviewLength = review.length;
  const isReviewWarning = reviewLength > 700 && reviewLength <= 800;
  const isReviewDanger = reviewLength > 800;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit your Field Note' : 'Share a Field Note'}
      subtitle="Help other travelers avoid logistical surprises with specific advice, accurate prices, and gate details."
      size="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="create-post-form">
        <div className="form-row form-row--2">
          {/* City */}
          <FormField
            as="select"
            ref={fieldRefs.city}
            label="Destination (Pilot Cities)"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => handleBlur('city', city)}
            error={touched.city ? errors.city : null}
          >
            {PILOT_CITY_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </FormField>

          {/* Place Name */}
          <FormField
            ref={fieldRefs.placeName}
            label="Place / Attraction Name"
            required
            placeholder="e.g. Amer Fort Suraj Pol Gate, Kalka Toy Train"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            onBlur={() => handleBlur('placeName', placeName)}
            error={touched.placeName ? errors.placeName : null}
            maxLength={60}
          />
        </div>

        <div className="form-row form-row--3">
          {/* Category */}
          <FormField
            as="select"
            ref={fieldRefs.category}
            label="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => handleBlur('category', category)}
            error={touched.category ? errors.category : null}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </FormField>

          {/* Month Visited */}
          <FormField
            ref={fieldRefs.monthVisited}
            type="month"
            label="Month Visited"
            required
            value={monthVisited}
            onChange={(e) => setMonthVisited(e.target.value)}
            onBlur={() => handleBlur('monthVisited', monthVisited)}
            error={touched.monthVisited ? errors.monthVisited : null}
          />

          {/* Rating */}
          <div className="form-group-star">
            <label className="ww-form-field__label">
              Overall Rating <span className="ww-form-field__required">*</span>
            </label>
            <div className="star-picker-container">
              <StarRating
                value={rating}
                onChange={(val) => setRating(val)}
                size="md"
                showScore
              />
            </div>
          </div>
        </div>

        <div className="form-row form-row--2">
          {/* Traveler Type */}
          <div className="segmented-group">
            <label className="ww-form-field__label">Traveler Type</label>
            <div className="segmented-controls" role="radiogroup">
              {TRAVELER_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`segmented-btn ${travelerType === type ? 'is-selected' : ''}`}
                  onClick={() => setTravelerType(type)}
                  role="radio"
                  aria-checked={travelerType === type}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Level */}
          <div className="segmented-group">
            <label className="ww-form-field__label">Budget Level</label>
            <div className="segmented-controls" role="radiogroup">
              {BUDGET_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`segmented-btn ${budgetLevel === level ? 'is-selected' : ''}`}
                  onClick={() => setBudgetLevel(level)}
                  role="radio"
                  aria-checked={budgetLevel === level}
                >
                  {level} {level === '₹' ? '(Budget)' : level === '₹₹' ? '(Mid-range)' : '(Premium)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <FormField
          ref={fieldRefs.title}
          label="Review Title"
          required
          placeholder="e.g. Arrive before 08:45 AM; avoid elephant touts at Suraj Pol"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title', title)}
          error={touched.title ? errors.title : null}
          hint="Be specific about timings, gates, or prices. 8–80 characters."
          maxLength={80}
        />

        {/* Review Content */}
        <FormField
          as="textarea"
          ref={fieldRefs.review}
          label="Your Honest Review"
          required
          placeholder="Write concrete logistical advice: ticket prices in ₹, queue times, which gate had taxis, safety precautions..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          onBlur={() => handleBlur('review', review)}
          error={touched.review ? errors.review : null}
          characterCount={{
            current: reviewLength,
            min: 20,
            max: 800,
            isWarning: isReviewWarning,
            isDanger: isReviewDanger
          }}
          rows={5}
        />

        {/* Optional Actionable Tips */}
        <div className="tips-section">
          <div className="tips-header">
            <label className="ww-form-field__label">Actionable Tips (Optional, up to 3)</label>
            {tips.length < 3 && (
              <button
                type="button"
                className="add-tip-btn"
                onClick={handleAddTip}
              >
                <Plus size={14} /> Add tip
              </button>
            )}
          </div>

          {tips.map((tip, idx) => (
            <div key={idx} className="tip-input-row">
              <input
                type="text"
                className="ww-form-control"
                placeholder={`Tip ${idx + 1}: e.g. Pre-book the government taxi counter inside platform 1`}
                value={tip}
                onChange={(e) => handleTipChange(idx, e.target.value)}
                maxLength={90}
              />
              {tips.length > 1 && (
                <button
                  type="button"
                  className="remove-tip-btn"
                  onClick={() => handleRemoveTip(idx)}
                  aria-label="Remove tip"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions-footer">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid}
          >
            {isEdit ? 'Save Changes' : 'Post Field Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
