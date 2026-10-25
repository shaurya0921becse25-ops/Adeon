/**
 * CommunityContext.jsx
 *
 * Central context providing posts, Reddit-style feed sorting, voting,
 * comments, city & category filtering, post deletion, and real statistics.
 */

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useCommunityPosts } from '../hooks/useCommunityPosts.js';
import { CATEGORIES, POPULAR_CITIES } from '../data/samplePosts.js';

const CommunityContext = createContext(null);

export function CommunityProvider({ children }) {
  const {
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
  } = useCommunityPosts();

  // --- Filter and Sort state ---
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('all');
  const [showSavedOnly,   setShowSavedOnly]   = useState(false);
  const [activeTag,       setActiveTag]       = useState(null);
  const [activeCity,      setActiveCity]      = useState(null);
  const [sortMode,        setSortMode]        = useState('hot'); // 'hot' | 'new' | 'top' | 'discussed'

  // --- Modal state ---
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailPost,      setDetailPost]      = useState(null);

  // --- Toast state ---
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // --- Honest calculated statistics from genuine post data ---
  const uniqueDestinationsCount = useMemo(() => {
    return new Set(allPosts.map(p => p.destination).filter(Boolean)).size;
  }, [allPosts]);

  const uniqueContributorsCount = useMemo(() => {
    return new Set(allPosts.map(p => p.author).filter(Boolean)).size;
  }, [allPosts]);

  // --- Filtered and Sorted posts (Categories & Destinations work together) ---
  const filteredPosts = useMemo(() => {
    let posts = showSavedOnly ? savedPosts : allPosts;

    if (activeCategory !== 'all') {
      posts = posts.filter(p => p.category === activeCategory);
    }

    if (activeCity) {
      const cityLower = activeCity.toLowerCase();
      posts = posts.filter(p =>
        (p.destination && p.destination.toLowerCase().includes(cityLower)) ||
        (p.state && p.state.toLowerCase().includes(cityLower))
      );
    }

    if (activeTag) {
      const cleanTag = activeTag.toLowerCase().replace(/^#/, '');
      posts = posts.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === cleanTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort according to Reddit-style sortMode
    return [...posts].sort((a, b) => {
      if (sortMode === 'new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortMode === 'top') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortMode === 'discussed') {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      }
      // 'hot': combination of recentness, upvotes, and comments activity
      const scoreA = (a.likes || 0) * 1.5 + (a.comments?.length || 0) * 3;
      const scoreB = (b.likes || 0) * 1.5 + (b.comments?.length || 0) * 3;
      return scoreB - scoreA;
    });
  }, [allPosts, savedPosts, searchQuery, activeCategory, showSavedOnly, activeTag, activeCity, sortMode]);

  const handleCategoryChange = useCallback((categoryId) => {
    setActiveTag(null);
    if (categoryId === 'saved') {
      setShowSavedOnly(true);
      setActiveCategory('all');
    } else {
      setShowSavedOnly(false);
      setActiveCategory(categoryId);
    }
  }, []);

  const handleSelectTag = useCallback((tag) => {
    setActiveTag(prev => (prev === tag ? null : tag));
    setShowSavedOnly(false);
  }, []);

  const handleSelectCity = useCallback((cityName) => {
    setActiveCity(prev => (prev === cityName ? null : cityName));
    setShowSavedOnly(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('all');
    setShowSavedOnly(false);
    setActiveTag(null);
    setActiveCity(null);
    setSortMode('hot');
  }, []);

  const handleAddPost = useCallback((formData) => {
    addPost(formData);
    setCreateModalOpen(false);
    showToast('Your travel story has been published to the Abeon community! 🌍');
  }, [addPost, showToast]);

  const handleDeletePost = useCallback((postId) => {
    deletePost(postId);
    setDetailPost(prev => {
      if (!prev) return null;
      const currentId = typeof prev === 'string' ? prev : prev.id;
      return currentId === postId ? null : prev;
    });
    showToast('Your travel story has been removed.');
  }, [deletePost, showToast]);

  const handleToggleVote = useCallback((postId, direction) => {
    toggleVote(postId, direction);
  }, [toggleVote]);

  const handleToggleLike = useCallback((postId) => {
    toggleLike(postId);
  }, [toggleLike]);

  const handleToggleSave = useCallback((postId) => {
    toggleSave(postId);
    const post = allPosts.find(p => p.id === postId);
    if (post) {
      showToast(post.isSaved ? 'Story removed from bookmarks' : 'Story saved to bookmarks! 🔖');
    }
  }, [toggleSave, allPosts, showToast]);

  const handleAddComment = useCallback((postId, commentData) => {
    addComment(postId, commentData);
    showToast('Comment posted! Thanks for adding to the conversation 💬');
  }, [addComment, showToast]);

  const handleToggleCommentLike = useCallback((commentId) => {
    toggleCommentLike(commentId);
  }, [toggleCommentLike]);

  const handleToggleFollow = useCallback((authorName) => {
    toggleFollowUser(authorName);
    const isNowFollowing = !followedUsers.has(authorName);
    showToast(isNowFollowing ? `You are now following ${authorName}! 👋` : `Unfollowed ${authorName}`);
  }, [toggleFollowUser, followedUsers, showToast]);

  const handleToggleJoin = useCallback(() => {
    toggleJoinCommunity();
    showToast(!communityJoined ? 'Welcome to the Abeon Community! 🎒' : 'Left community');
  }, [toggleJoinCommunity, communityJoined, showToast]);

  const activeDetailPost = useMemo(() => {
    if (!detailPost) return null;
    const postId = typeof detailPost === 'string' ? detailPost : detailPost.id;
    return allPosts.find(p => p.id === postId) || detailPost;
  }, [detailPost, allPosts]);

  const value = useMemo(() => ({
    // Data
    filteredPosts,
    allPostsCount: allPosts.length,
    savedCount:    savedPosts.length,
    destinationsCount: uniqueDestinationsCount,
    contributorsCount: uniqueContributorsCount,
    categories:    CATEGORIES,
    cities:        POPULAR_CITIES,

    // Filter & Sort state
    searchQuery,    setSearchQuery,
    activeCategory, showSavedOnly,
    activeTag,      handleSelectTag,
    activeCity,     handleSelectCity,
    sortMode,       setSortMode,
    handleCategoryChange,
    clearFilters,
    handleResetFilters: clearFilters,

    // Post actions & Voting
    handleToggleVote,
    handleToggleLike,
    handleToggleSave,
    handleAddPost,
    handleDeletePost,
    handleAddComment,
    handleToggleCommentLike,
    handleToggleFollow,
    followedUsers,

    // Community membership
    communityJoined,
    handleToggleJoin,

    // Modals
    createModalOpen, setCreateModalOpen,
    detailPost:      activeDetailPost,
    setDetailPost,

    // Toast
    toast,
    showToast,
  }), [
    filteredPosts, allPosts.length, savedPosts.length,
    uniqueDestinationsCount, uniqueContributorsCount,
    searchQuery, activeCategory, showSavedOnly, activeTag, handleSelectTag, activeCity, handleSelectCity, sortMode,
    handleCategoryChange, clearFilters,
    handleToggleVote, handleToggleLike, handleToggleSave, handleAddPost, handleDeletePost,
    handleAddComment, handleToggleCommentLike, handleToggleFollow, followedUsers,
    communityJoined, handleToggleJoin,
    createModalOpen, activeDetailPost,
    toast, showToast,
  ]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
