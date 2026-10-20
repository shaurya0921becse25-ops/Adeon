import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTopCommunityPosts } from '../../store/communitySlice';
import { MessageSquare, ArrowRight } from 'lucide-react';
import './CommunityMoments.css';

export default function CommunityMoments() {
  const posts = useSelector(selectTopCommunityPosts).slice(0, 4);

  return (
    <section className="community-moments" aria-label="Community notes" id="community-notes">
      <div className="container">
        <div className="community-moments__header">
          <p className="abeon-caption">from the field notes feed</p>
          <h2 className="community-moments__title">Community Notes</h2>
          <p className="community-moments__sub">
            Real posts from travellers and local guides — honest perspectives from the ground.
          </p>
        </div>
        <div className="community-moments__grid">
          {posts.length > 0 ? posts.map((post, i) => (
            <Link key={post.id} to="/community" className={`community-moments__quote offset-${i}`} aria-label={`Read community post by ${post.author?.name || 'traveller'}`}>
              <span className="community-moments__icon" aria-hidden="true">
                <MessageSquare size={16} strokeWidth={1.5} />
              </span>
              <blockquote>&ldquo;{(post.review || post.title || '').slice(0, 140)}&rdquo;</blockquote>
              <cite>{post.author?.name || 'traveller'} &middot; demo post</cite>
            </Link>
          )) : (
            <p className="community-moments__empty">No community posts yet — be the first to share your experience.</p>
          )}
        </div>
        <Link to="/community" className="community-moments__cta" aria-label="View all community posts">
          View all community posts <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
