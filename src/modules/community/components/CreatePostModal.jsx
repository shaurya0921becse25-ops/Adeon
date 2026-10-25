import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

export default function CreatePostModal() {
  const { createModalOpen, setCreateModalOpen, handleAddPost, categories } = useCommunity();

  const [destination, setDestination] = useState('');
  const [state, setState]             = useState('');
  const [category, setCategory]       = useState('mountains');
  const [budget, setBudget]           = useState('');
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [tip, setTip]                 = useState('');
  const [imageUrl, setImageUrl]       = useState('');
  const [tags, setTags]               = useState('');

  const [errors, setErrors]           = useState({});
  const [imageValid, setImageValid]   = useState(true);

  // Reset form when modal opens
  useEffect(() => {
    if (createModalOpen) {
      setDestination('');
      setState('');
      setCategory('mountains');
      setBudget('');
      setTitle('');
      setDescription('');
      setTip('');
      setImageUrl('');
      setTags('');
      setErrors({});
      setImageValid(true);
    }
  }, [createModalOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && createModalOpen) {
        setCreateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createModalOpen, setCreateModalOpen]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const newErrors = {};
    if (!destination.trim()) {
      newErrors.destination = 'Please provide a destination name.';
    }
    if (!title.trim()) {
      newErrors.title = 'Please add a catchy headline for your experience.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please write something about your travel experience.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters long.';
    } else if (description.trim().length > 800) {
      newErrors.description = 'Description exceeds the 800 character limit.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleAddPost({
      destination: destination.trim(),
      state: state.trim() || null,
      category,
      budget: budget.trim() || null,
      title: title.trim(),
      description: description.trim(),
      tip: tip.trim() || null,
      imageUrl: imageUrl.trim() || null,
      tags: tags.trim() || '',
    });
  }, [destination, state, category, budget, title, description, tip, imageUrl, tags, handleAddPost]);

  if (!createModalOpen) return null;

  const charLength = description.length;

  return (
    <div
      className="modal-overlay"
      onClick={() => setCreateModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#FFFFFF', color: '#2C221D' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="create-modal-title" className="modal-title">
              Share Your Experience
            </h2>
            <p className="modal-subtitle">
              Inspire fellow travellers with your stories, tips & photos
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setCreateModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Destination & State */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="post-destination" className="form-label">
                  Destination <span>*</span>
                </label>
                <input
                  id="post-destination"
                  type="text"
                  className={`input${errors.destination ? ' error' : ''}`}
                  placeholder="e.g. Manali, Ladakh, Hampi"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) {
                      setErrors(prev => ({ ...prev, destination: null }));
                    }
                  }}
                  autoFocus
                />
                {errors.destination && (
                  <span className="form-error">{errors.destination}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="post-state" className="form-label">
                  State / Region
                </label>
                <input
                  id="post-state"
                  type="text"
                  className="input"
                  placeholder="e.g. Himachal Pradesh"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>

            {/* Category & Budget */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="post-category" className="form-label">
                  Category <span>*</span>
                </label>
                <select
                  id="post-category"
                  className="input select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="post-budget" className="form-label">
                  Estimated Budget
                </label>
                <input
                  id="post-budget"
                  type="text"
                  className="input"
                  placeholder="e.g. ₹1,800/day (dorm + food)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="post-title" className="form-label">
                Story Title <span>*</span>
              </label>
              <input
                id="post-title"
                type="text"
                className={`input${errors.title ? ' error' : ''}`}
                placeholder="A catchy headline for your experience..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: null }));
                  }
                }}
              />
              {errors.title && (
                <span className="form-error">{errors.title}</span>
              )}
            </div>

            {/* Story / Description */}
            <div className="form-group">
              <label htmlFor="post-desc" className="form-label">
                Your Story & Tips <span>*</span>
              </label>
              <textarea
                id="post-desc"
                className={`input textarea${errors.description ? ' error' : ''}`}
                rows={5}
                placeholder="Describe your journey, highlights, favorite moments, and practical advice..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: null }));
                  }
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {errors.description ? (
                  <span className="form-error">{errors.description}</span>
                ) : (
                  <span className="form-hint">At least 15 characters</span>
                )}
                <span
                  className={`char-counter${
                    charLength > 750
                      ? charLength > 800
                        ? ' over'
                        : ' warn'
                      : ''
                  }`}
                >
                  {charLength}/800
                </span>
              </div>
            </div>

            {/* Insider Tip */}
            <div className="form-group">
              <label htmlFor="post-tip" className="form-label">
                Insider Travel Tip 💡
              </label>
              <input
                id="post-tip"
                type="text"
                className="input"
                placeholder="e.g. Reach by 5:30 AM to beat the crowd; hire local guide from town."
                value={tip}
                onChange={(e) => setTip(e.target.value)}
              />
              <span className="form-hint">
                One secret or must-know tip for anyone visiting!
              </span>
            </div>

            {/* Photo / Image (Optional) */}
            <div className="form-group">
              <label htmlFor="post-image" className="form-label">
                Add a Photo <span style={{ fontWeight: 'normal', color: 'var(--color-text-muted)' }}>(Optional)</span>
              </label>
              <input
                id="post-image"
                type="url"
                className="input"
                placeholder="Paste an image link, or select a quick sample below..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageValid(true);
                }}
              />
              <span className="form-hint">
                Add a visual to your story. Paste any photo link, pick a sample below, or leave it blank!
              </span>

              {/* Quick sample photo selector */}
              <div className="photo-quick-picks">
                <span className="photo-quick-picks__label">Quick sample photos:</span>
                <button
                  type="button"
                  className="photo-chip-btn"
                  onClick={() => {
                    setImageUrl('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80&auto=format&fit=crop');
                    setImageValid(true);
                  }}
                >
                  🏔️ Mountain Snow
                </button>
                <button
                  type="button"
                  className="photo-chip-btn"
                  onClick={() => {
                    setImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop');
                    setImageValid(true);
                  }}
                >
                  🏰 Lake Palace
                </button>
                <button
                  type="button"
                  className="photo-chip-btn"
                  onClick={() => {
                    setImageUrl('https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80&auto=format&fit=crop');
                    setImageValid(true);
                  }}
                >
                  ☕ Street Food
                </button>
                <button
                  type="button"
                  className="photo-chip-btn"
                  onClick={() => {
                    setImageUrl('https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=800&q=80&auto=format&fit=crop');
                    setImageValid(true);
                  }}
                >
                  🧗 Pine Trek
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    className="photo-chip-btn clear"
                    onClick={() => setImageUrl('')}
                  >
                    ✕ Remove Photo
                  </button>
                )}
              </div>

              {imageUrl && imageValid && (
                <div className="image-preview" style={{ marginTop: 'var(--space-2)' }}>
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    onError={() => setImageValid(false)}
                  />
                </div>
              )}
              {imageUrl && !imageValid && (
                <span className="form-error">Could not load preview from this URL. Please verify the link.</span>
              )}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="post-tags" className="form-label">
                Tags (comma separated)
              </label>
              <input
                id="post-tags"
                type="text"
                className="input"
                placeholder="trekking, sunrise, food, budget"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-post-btn"
              className="btn btn-primary"
            >
              Publish Story 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
