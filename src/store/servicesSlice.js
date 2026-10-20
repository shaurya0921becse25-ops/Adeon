import { createSlice, createSelector } from '@reduxjs/toolkit';
import { SEED_CATALOG } from '../data/servicesSeed';

const LS_KEY = 'wanderwise_services_state_v2';
const LEGACY_KEY = 'abeon_services_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY) || localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        guides: parsed.guides?.length ? parsed.guides : SEED_CATALOG.guides,
        services: parsed.services?.length ? parsed.services : SEED_CATALOG.services,
        reviews: parsed.reviews?.length ? parsed.reviews : SEED_CATALOG.reviews,
        savedIds: parsed.savedIds ?? SEED_CATALOG.savedIds ?? [],
        compareIds: parsed.compareIds ?? [],
        threads: parsed.threads?.length ? parsed.threads : SEED_CATALOG.threads,
        bookings: parsed.bookings?.length ? parsed.bookings : SEED_CATALOG.bookings,
        attachedServices: parsed.attachedServices?.length ? parsed.attachedServices : SEED_CATALOG.attachedServices ?? []
      };
    }
  } catch (e) {
    console.warn('Error reading services state from localStorage:', e);
  }

  return {
    guides: SEED_CATALOG.guides,
    services: SEED_CATALOG.services,
    reviews: SEED_CATALOG.reviews,
    savedIds: SEED_CATALOG.savedIds || [],
    compareIds: [],
    threads: SEED_CATALOG.threads || [],
    bookings: SEED_CATALOG.bookings || [],
    attachedServices: SEED_CATALOG.attachedServices || []
  };
}

function persist(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage error saving services state:', e);
  }
}

const initialState = loadState();

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    toggleSaved: (state, action) => {
      const id = action.payload;
      if (state.savedIds.includes(id)) {
        state.savedIds = state.savedIds.filter((x) => x !== id);
      } else {
        state.savedIds.push(id);
      }
      persist(state);
    },
    removeSaved: (state, action) => {
      state.savedIds = state.savedIds.filter((x) => x !== action.payload);
      persist(state);
    },
    toggleCompareService: (state, action) => {
      const id = action.payload;
      if (state.compareIds.includes(id)) {
        state.compareIds = state.compareIds.filter((x) => x !== id);
      } else if (state.compareIds.length < 3) {
        state.compareIds.push(id);
      }
      persist(state);
    },
    clearCompareServices: (state) => {
      state.compareIds = [];
      persist(state);
    },
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
      persist(state);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const b = state.bookings.find((x) => x.id === id);
      if (b) b.status = status;
      persist(state);
    },
    cancelBooking: (state, action) => {
      const { id } = action.payload;
      const b = state.bookings.find((x) => x.id === id);
      if (b) b.status = 'declined';
      persist(state);
    },
    addReview: (state, action) => {
      state.reviews.unshift(action.payload);
      persist(state);
    },
    editReview: (state, action) => {
      const { id, rating, text, tags } = action.payload;
      const r = state.reviews.find((x) => x.id === id);
      if (r) {
        if (rating !== undefined) r.rating = rating;
        if (text !== undefined) r.text = text;
        if (tags !== undefined) r.tags = tags;
      }
      persist(state);
    },
    deleteReview: (state, action) => {
      state.reviews = state.reviews.filter((x) => x.id !== action.payload);
      persist(state);
    },
    voteHelpfulReview: (state, action) => {
      const r = state.reviews.find((x) => x.id === action.payload);
      if (r) {
        r.helpful = (r.helpful || 0) + 1;
      }
      persist(state);
    },
    upsertThread: (state, action) => {
      const idx = state.threads.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) state.threads[idx] = action.payload;
      else state.threads.unshift(action.payload);
      persist(state);
    },
    appendMessage: (state, action) => {
      const { threadId, message } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        thread.messages.push(message);
        if (message.from === 'guide') {
          thread.unread = (thread.unread || 0) + 1;
        }
      } else {
        // If thread doesn't exist yet, create it
        state.threads.unshift({
          id: threadId,
          guideId: message.guideId,
          unread: message.from === 'guide' ? 1 : 0,
          messages: [message]
        });
      }
      persist(state);
    },
    markThreadRead: (state, action) => {
      const thread = state.threads.find((t) => t.id === action.payload);
      if (thread) thread.unread = 0;
      persist(state);
    },
    attachServiceToItinerary: (state, action) => {
      const item = action.payload;
      const exists = state.attachedServices.some((x) => x.serviceId === item.serviceId && x.day === item.day);
      if (!exists) {
        state.attachedServices.push(item);
      }
      persist(state);
    },
    removeServiceFromItinerary: (state, action) => {
      state.attachedServices = state.attachedServices.filter(
        (x) => x.serviceId !== action.payload && x.id !== action.payload
      );
      persist(state);
    }
  }
});

export const {
  toggleSaved,
  removeSaved,
  toggleCompareService,
  clearCompareServices,
  addBooking,
  updateBookingStatus,
  cancelBooking,
  addReview,
  editReview,
  deleteReview,
  voteHelpfulReview,
  upsertThread,
  appendMessage,
  markThreadRead,
  attachServiceToItinerary,
  removeServiceFromItinerary
} = servicesSlice.actions;

export const selectAllServices = (state) => state.services?.services || [];
export const selectGuides = (state) => state.services?.guides || [];
export const selectReviews = (state) => state.services?.reviews || [];
export const selectSavedIds = (state) => state.services?.savedIds || [];
export const selectCompareServiceIds = (state) => state.services?.compareIds || [];
export const selectBookings = (state) => state.services?.bookings || [];
export const selectThreads = (state) => state.services?.threads || [];
export const selectAttachedServices = (state) => state.services?.attachedServices || [];

export const selectGuideById = (id) =>
  createSelector([selectGuides], (guides) => guides.find((g) => g.id === id));

export const selectServiceRows = createSelector(
  [selectAllServices, selectGuides, selectReviews],
  (services, guides, reviews) =>
    services.map((svc) => {
      const guide = guides.find((g) => g.id === svc.guideId);
      const svcReviews = reviews.filter((r) => r.serviceId === svc.id);
      const rating =
        svcReviews.length > 0
          ? Number((svcReviews.reduce((a, r) => a + r.rating, 0) / svcReviews.length).toFixed(1))
          : guide?.rating ?? 4.8;
      return { ...svc, guide, rating, reviewCount: svcReviews.length };
    })
);

export const selectUnreadMessagesCount = createSelector(
  [selectThreads],
  (threads) => threads.reduce((acc, t) => acc + (t.unread || 0), 0)
);

export const selectBookingUpdateCount = createSelector(
  [selectBookings],
  (bookings) => bookings.filter((b) => b.status === 'requested' || b.status === 'accepted').length
);

export const selectItineraryServicesTotal = createSelector(
  [selectAttachedServices],
  (attached) => attached.reduce((acc, item) => acc + (item.total || item.price || 0), 0)
);

export default servicesSlice.reducer;
