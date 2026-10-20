import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_POSTS } from '../data/posts';

const STORAGE_KEY_POSTS = 'wanderwise_community_posts';
const STORAGE_KEY_SAVED = 'wanderwise_saved_places';

function loadInitialPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_POSTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read posts from localStorage:', e);
  }
  return INITIAL_POSTS;
}

function loadInitialSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read saved places from localStorage:', e);
  }
  return [];
}

const initialState = {
  posts: loadInitialPosts(),
  savedPlaces: loadInitialSaved(),
  filters: {
    cities: [],
    categories: [],
    travelerTypes: [],
    budgetLevels: [],
    minRating: 0,
    visitedLast12Months: false
  },
  sort: 'helpful', // 'helpful' | 'newest' | 'topRated'
  searchQuery: '',
  userHelpfulVotes: {} // { [postId]: true }
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      try {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(state.posts));
      } catch (e) {
        console.warn('Failed to save posts to localStorage:', e);
      }
    },
    editPost: (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
        try {
          localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(state.posts));
        } catch (e) {
          console.warn('Failed to update posts in localStorage:', e);
        }
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(state.posts));
      } catch (e) {
        console.warn('Failed to update posts in localStorage:', e);
      }
    },
    toggleHelpful: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      const hasVoted = !!state.userHelpfulVotes[postId];
      if (hasVoted) {
        delete state.userHelpfulVotes[postId];
        post.helpfulCount = Math.max(0, (post.helpfulCount || 1) - 1);
      } else {
        state.userHelpfulVotes[postId] = true;
        post.helpfulCount = (post.helpfulCount || 0) + 1;
      }
      try {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(state.posts));
      } catch (e) {
        console.warn('Failed to save helpful vote:', e);
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        try {
          localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(state.posts));
        } catch (e) {
          console.warn('Failed to save comment:', e);
        }
      }
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        cities: [],
        categories: [],
        travelerTypes: [],
        budgetLevels: [],
        minRating: 0,
        visitedLast12Months: false
      };
      state.searchQuery = '';
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    savePlace: (state, action) => {
      const place = action.payload; // { id, placeName, city, category, notes }
      const exists = state.savedPlaces.some((p) => p.id === place.id || p.placeName === place.placeName);
      if (!exists) {
        state.savedPlaces.push({
          ...place,
          savedAt: new Date().toISOString()
        });
        try {
          localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(state.savedPlaces));
        } catch (e) {
          console.warn('Failed to save place to localStorage:', e);
        }
      }
    },
    removeSavedPlace: (state, action) => {
      state.savedPlaces = state.savedPlaces.filter(
        (p) => p.id !== action.payload && p.placeName !== action.payload
      );
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(state.savedPlaces));
      } catch (e) {
        console.warn('Failed to update saved places:', e);
      }
    }
  }
});

export const {
  addPost,
  editPost,
  deletePost,
  toggleHelpful,
  addComment,
  setFilter,
  clearFilters,
  setSort,
  setSearchQuery,
  savePlace,
  removeSavedPlace
} = communitySlice.actions;

// Selectors
export const selectAllPosts = (state) => state.community.posts;
export const selectSavedPlaces = (state) => state.community.savedPlaces;
export const selectFilters = (state) => state.community.filters;
export const selectSort = (state) => state.community.sort;
export const selectSearchQuery = (state) => state.community.searchQuery;
export const selectUserHelpfulVotes = (state) => state.community.userHelpfulVotes;

// Selector for filtered & sorted posts
export const selectFilteredPosts = (state) => {
  const { posts, filters, sort, searchQuery } = state.community;
  const now = new Date();

  return posts.filter((post) => {
    // City multi-select
    if (filters.cities.length > 0 && !filters.cities.includes(post.city)) {
      return false;
    }
    // Category multi-select
    if (filters.categories.length > 0 && !filters.categories.includes(post.category)) {
      return false;
    }
    // Traveler type
    if (filters.travelerTypes.length > 0 && !filters.travelerTypes.includes(post.travelerType)) {
      return false;
    }
    // Budget level
    if (filters.budgetLevels.length > 0 && !filters.budgetLevels.includes(post.budgetLevel)) {
      return false;
    }
    // Min rating
    if (filters.minRating > 0 && post.rating < filters.minRating) {
      return false;
    }
    // Visited in last 12 months
    if (filters.visitedLast12Months && post.monthVisited) {
      const visitDate = new Date(post.monthVisited);
      const diffMonths = (now.getFullYear() - visitDate.getFullYear()) * 12 + (now.getMonth() - visitDate.getMonth());
      if (diffMonths > 12) return false;
    }
    // Search query with debounce matching title, city, place, or review content
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchCity = post.city?.toLowerCase().includes(q);
      const matchPlace = post.placeName?.toLowerCase().includes(q);
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchReview = post.review?.toLowerCase().includes(q);
      if (!matchCity && !matchPlace && !matchTitle && !matchReview) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sort === 'topRated') {
      return b.rating - a.rating;
    }
    // Default 'helpful'
    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
  });
};

// Selector for 3 highest-rated/helpful posts on Home
export const selectTopCommunityPosts = (state) => {
  const posts = [...state.community.posts];
  return posts.sort((a, b) => (b.rating * 10 + (b.helpfulCount || 0)) - (a.rating * 10 + (a.helpfulCount || 0))).slice(0, 3);
};

export default communitySlice.reducer;
