/**
 * useCommunityPosts.js
 *
 * Custom hook that manages the community posts, voting, comments,
 * and social interactions (following, saving, joining, deleting).
 *
 * Persists all state into localStorage:
 *   ww_liked_ids         – Saved liked IDs (legacy)
 *   ww_saved_ids         – Saved bookmarked post IDs
 *   ww_user_posts        – Posts created by the user in this session
 *   ww_like_deltas       – Upvote/karma adjustments map
 *   ww_user_votes        – Map of postId → 'up' | 'down' | null
 *   ww_custom_comments   – Map of postId → array of user-submitted comments
 *   ww_comment_likes     – Map of commentId → boolean
 *   ww_followed_users    – Array of followed author names
 *   ww_community_joined  – Boolean indicating whether user joined Abeon
 *   ww_deleted_post_ids  – Set of post IDs deleted by user
 */

import { useState, useEffect, useCallback } from 'react';
import { samplePosts } from '../data/samplePosts.js';
import { nanoid } from 'nanoid';

const STORAGE_KEYS = {
  LIKED:           'ww_liked_ids',
  SAVED:           'ww_saved_ids',
  USER_POSTS:      'ww_user_posts',
  LIKE_DELTAS:     'ww_like_deltas',
  VOTES:           'ww_user_votes',
  CUSTOM_COMMENTS: 'ww_custom_comments',
  COMMENT_LIKES:   'ww_comment_likes',
  FOLLOWED_USERS:  'ww_followed_users',
  COMMUNITY_JOIN:  'ww_community_joined',
  DELETED_POSTS:   'ww_deleted_post_ids',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silent fail
  }
}

function isAccidentalTestPost(post) {
  if (!post) return false;
  const title = (post.title || '').trim().toLowerCase();
  const desc = (post.description || '').trim().toLowerCase();
  return title === 'drfytguij' || desc.startsWith('dfhiug vgds uyufytdrtsxhj uhk');
}

export function useCommunityPosts() {
  // ----- State from localStorage -----
  const [savedIds,        setSavedIds]        = useState(() => new Set(readJSON(STORAGE_KEYS.SAVED, [])));
  const [userPosts,       setUserPosts]       = useState(() => {
    const raw = readJSON(STORAGE_KEYS.USER_POSTS, []);
    return Array.isArray(raw) ? raw.filter(p => !isAccidentalTestPost(p)) : [];
  });
  const [deletedPostIds,  setDeletedPostIds]  = useState(() => new Set(readJSON(STORAGE_KEYS.DELETED_POSTS, [])));
  const [likeDeltas,      setLikeDeltas]      = useState(() => readJSON(STORAGE_KEYS.LIKE_DELTAS, {}));
  const [userVotes,       setUserVotes]       = useState(() => readJSON(STORAGE_KEYS.VOTES, {}));
  const [customComments,  setCustomComments]  = useState(() => readJSON(STORAGE_KEYS.CUSTOM_COMMENTS, {}));
  const [commentLikes,    setCommentLikes]    = useState(() => readJSON(STORAGE_KEYS.COMMENT_LIKES, {}));
  const [followedUsers,   setFollowedUsers]   = useState(() => new Set(readJSON(STORAGE_KEYS.FOLLOWED_USERS, [])));
  const [communityJoined, setCommunityJoined] = useState(() => readJSON(STORAGE_KEYS.COMMUNITY_JOIN, true));

  // ----- Persist changes to localStorage -----
  useEffect(() => { writeJSON(STORAGE_KEYS.SAVED,           [...savedIds]); },       [savedIds]);
  useEffect(() => { writeJSON(STORAGE_KEYS.USER_POSTS,      userPosts); },           [userPosts]);
  useEffect(() => { writeJSON(STORAGE_KEYS.DELETED_POSTS,   [...deletedPostIds]); }, [deletedPostIds]);
  useEffect(() => { writeJSON(STORAGE_KEYS.LIKE_DELTAS,     likeDeltas); },          [likeDeltas]);
  useEffect(() => { writeJSON(STORAGE_KEYS.VOTES,           userVotes); },           [userVotes]);
  useEffect(() => { writeJSON(STORAGE_KEYS.CUSTOM_COMMENTS, customComments); },      [customComments]);
  useEffect(() => { writeJSON(STORAGE_KEYS.COMMENT_LIKES,   commentLikes); },        [commentLikes]);
  useEffect(() => { writeJSON(STORAGE_KEYS.FOLLOWED_USERS,  [...followedUsers]); },  [followedUsers]);
  useEffect(() => { writeJSON(STORAGE_KEYS.COMMUNITY_JOIN,  communityJoined); },     [communityJoined]);

  // ----- Merge all posts with dynamic state & filter deleted/test posts -----
  const allPosts = [...userPosts, ...samplePosts]
    .filter(post => !deletedPostIds.has(post.id) && !isAccidentalTestPost(post))
    .map(post => {
      const postVote = userVotes[post.id] || (post.isLiked ? 'up' : null);
      const delta = likeDeltas[post.id] ?? 0;
      const baseLikes = post.likes ?? 0;
      const totalLikes = Math.max(0, baseLikes + delta);

      const seedComments = post.comments || [];
      const userAddedComments = customComments[post.id] || [];
      const mergedComments = [...userAddedComments, ...seedComments].map(c => ({
        ...c,
        isLiked: Boolean(commentLikes[c.id]),
        likes: (c.likes || 0) + (commentLikes[c.id] ? 1 : 0),
      }));

      const isOwner = post.author === 'You' || post.id?.startsWith('user-');

      return {
        ...post,
        isOwner,
        isSaved: savedIds.has(post.id),
        isLiked: postVote === 'up',
        userVote: postVote, // 'up' | 'down' | null
        likes: totalLikes,
        comments: mergedComments,
        isAuthorFollowed: followedUsers.has(post.author),
      };
    });

  // ----- Upvote / Downvote (Reddit style) -----
  const toggleVote = useCallback((postId, direction) => {
    setUserVotes(prev => {
      const current = prev[postId] || null;
      let newVote = null;
      let diff = 0;

      if (current === direction) {
        // Cancel vote
        newVote = null;
        diff = direction === 'up' ? -1 : 1;
      } else if (!current) {
        // Cast new vote
        newVote = direction;
        diff = direction === 'up' ? 1 : -1;
      } else if (current === 'up' && direction === 'down') {
        // Switch from up to down
        newVote = 'down';
        diff = -2;
      } else if (current === 'down' && direction === 'up') {
        // Switch from down to up
        newVote = 'up';
        diff = 2;
      }

      setLikeDeltas(d => ({
        ...d,
        [postId]: (d[postId] ?? 0) + diff,
      }));

      const next = { ...prev };
      if (newVote) {
        next[postId] = newVote;
      } else {
        delete next[postId];
      }
      return next;
    });
  }, []);

  // Backward compatibility alias for toggleLike
  const toggleLike = useCallback((postId) => {
    toggleVote(postId, 'up');
  }, [toggleVote]);

  // ----- Save / Bookmark -----
  const toggleSave = useCallback((postId) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else                   next.add(postId);
      return next;
    });
  }, []);

  // ----- Comments -----
  const addComment = useCallback((postId, { text, author = 'You (Explorer)' }) => {
    if (!text || !text.trim()) return;

    const newComment = {
      id: 'cmt-' + nanoid(8),
      author: author.trim(),
      authorInitials: 'ME',
      avatarBg: '#91B8C7',
      time: 'Just now',
      text: text.trim(),
      likes: 0,
      isAuthor: author === 'You' || author.includes('Author'),
    };

    setCustomComments(prev => {
      const current = prev[postId] || [];
      return {
        ...prev,
        [postId]: [newComment, ...current],
      };
    });

    return newComment;
  }, []);

  const toggleCommentLike = useCallback((commentId) => {
    setCommentLikes(prev => {
      const next = { ...prev };
      if (next[commentId]) {
        delete next[commentId];
      } else {
        next[commentId] = true;
      }
      return next;
    });
  }, []);

  // ----- Connect / Follow User -----
  const toggleFollowUser = useCallback((authorName) => {
    if (!authorName) return;
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(authorName)) next.delete(authorName);
      else                      next.add(authorName);
      return next;
    });
  }, []);

  // ----- Toggle Joined Community -----
  const toggleJoinCommunity = useCallback(() => {
    setCommunityJoined(prev => !prev);
  }, []);

  // ----- Delete Post -----
  const deletePost = useCallback((postId) => {
    setUserPosts(prev => prev.filter(p => p.id !== postId));
    setDeletedPostIds(prev => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });
  }, []);

  // ----- Add Post -----
  const addPost = useCallback((formData) => {
    const newPost = {
      id:             'user-' + nanoid(8),
      author:         'You',
      authorInitials: 'ME',
      authorBadge:    '🎒 Explorer',
      destination:    formData.destination,
      state:          formData.state,
      category:       formData.category,
      title:          formData.title,
      description:    formData.description,
      tip:            formData.tip || null,
      budget:         formData.budget || null,
      imageUrl:       formData.imageUrl || null,
      tags:           formData.tags ? formData.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [],
      likes:          1, // poster automatically upvotes their own post
      isLiked:        true,
      isSaved:        false,
      userVote:       'up',
      createdAt:      new Date().toISOString(),
      comments:       [],
    };

    setUserPosts(prev => [newPost, ...prev]);
    setUserVotes(prev => ({ ...prev, [newPost.id]: 'up' }));
    return newPost;
  }, []);

  const savedPosts = allPosts.filter(p => savedIds.has(p.id));

  return {
    allPosts,
    savedPosts,
    toggleVote,
    toggleLike,
    toggleSave,
    addComment,
    toggleCommentLike,
    toggleFollowUser,
    followedUsers,
    communityJoined,
    toggleJoinCommunity,
    addPost,
    deletePost,
  };
}
