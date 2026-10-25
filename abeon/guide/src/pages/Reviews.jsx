import React, { useState } from "react";
import { Star, MessageSquare, Check, ThumbsUp } from "lucide-react";
import Tabs from "../ui/tabs";
import Card from "../ui/card";
import { useApp } from "../data/AppContext";

const realisticAvatars = {
  "Lisa Carter": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
  "Daniel Kim": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80",
  "Priya Nair": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
  "Tom Becker": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
  "Sarah Johnson": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
  "Michael Tan": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
  "Emma Davis": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
};

function Stars({ value, size = 15 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= value ? "#d97706" : "none"}
          color={n <= value ? "#d97706" : "#cbd5e1"}
        />
      ))}
    </div>
  );
}

const sentiment = (r) => (r >= 4 ? "Positive" : r === 3 ? "Neutral" : "Negative");

function Review({ review, onReply }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onReply(review.id, text);
    setText("");
    setOpen(false);
  };

  const avatarUrl =
    realisticAvatars[review.name] ||
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80`;

  return (
    <div className="review-item-card">
      <div className="review-top">
        <img
          src={avatarUrl}
          alt={review.name}
          className="review-avatar-img"
          loading="lazy"
        />
        <div className="review-user-info">
          <p className="review-name">{review.name}</p>
          <p className="review-date-meta">Verified Traveler Journey · {review.date}</p>
        </div>
        <div className="review-stars-wrap">
          <Stars value={review.rating} size={16} />
          <span className="rating-score-pill">{review.rating}.0</span>
        </div>
      </div>

      <p className="review-text">"{review.text}"</p>

      {review.tags && review.tags.length > 0 && (
        <div className="review-tags-list">
          {review.tags.map((t) => (
            <span key={t} className="review-tag-chip">
              <ThumbsUp size={11} /> {t}
            </span>
          ))}
        </div>
      )}

      {review.reply && (
        <div className="reply-sent-container">
          <div className="reply-sent-header">
            <span className="reply-host-badge">Your Official Response</span>
          </div>
          <p className="reply-sent-text">{review.reply}</p>
        </div>
      )}

      {!review.reply && !open && (
        <div className="reply-trigger-wrap">
          <button
            className="btn btn-outline btn-sm btn-reply"
            onClick={() => setOpen(true)}
          >
            <MessageSquare size={13} /> Reply to traveler
          </button>
        </div>
      )}

      {open && (
        <div className="reply-form-wrap">
          <input
            className="input reply-input"
            placeholder="Thank traveler or address their feedback publicly..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <div className="reply-form-actions">
            <button className="btn btn-primary btn-sm" onClick={submit}>
              Post Reply
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Reviews() {
  const { reviews: list, replyToReview, ratingBreakdown } = useApp();
  const [tab, setTab] = useState("All");

  const visible = list.filter(
    (r) => tab === "All" || sentiment(r.rating) === tab
  );
  const average = (
    list.reduce((sum, r) => sum + r.rating, 0) / (list.length || 1)
  ).toFixed(1);

  return (
    <div className="reviews-page">
      <div className="page-head" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Traveler Reviews &amp; Feedback</h1>
        <p className="page-sub">
          Authentic testimonials left by global adventurers after completing mountain trails with you.
        </p>
      </div>

      <Tabs
        tabs={["All", "Positive", "Neutral", "Negative"]}
        value={tab}
        onChange={setTab}
      />

      <div className="reviews-layout-grid">
        {/* Left Column: Rating breakdown card */}
        <div className="reviews-summary-col">
          <Card className="rating-summary-card">
            <div className="rating-summary-header">
              <span className="rating-big">{average}</span>
              <Stars value={Math.round(average)} size={22} />
              <p className="rating-subtext">
                Overall score based on {list.length} verified reviews
              </p>
            </div>

            <div className="rating-bars-container">
              {ratingBreakdown.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span className="bar-label">{item.label}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(item.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="bar-value">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="rating-trust-stamp">
              <Check size={14} className="trust-check" />
              <span>100% Verified Traveler Reviews</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Reviews List */}
        <div className="reviews-list-col">
          {visible.length === 0 ? (
            <Card>
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p style={{ fontSize: 15, color: "var(--ink-muted)" }}>
                  No reviews in this category yet.
                </p>
              </div>
            </Card>
          ) : (
            visible.map((r) => (
              <Card key={r.id} className="review-card">
                <Review review={r} onReply={replyToReview} />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}