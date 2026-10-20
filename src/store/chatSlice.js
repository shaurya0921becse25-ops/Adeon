import { createSlice } from '@reduxjs/toolkit';
import { calculateMatchScores } from '../utils/matchScore';

const SESSION_KEY_CHAT = 'wanderwise_trip_match_session_v2';

const VALID_STEPS = ['scenery', 'vibe', 'travelers', 'moment', 'result'];

const defaultPreferences = {
  scenery: 'mountains',
  vibe: 'slow',
  travelers: 'solo',
  moment: 'snow_chai',
  season: 'flexible',
  seasonMonth: null,
  climate: 'any',
  pace: 'balanced',
  mustHaves: [],
};

function loadInitialChat() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY_CHAT);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.preferences) {
        return {
          step: VALID_STEPS.includes(parsed.step) ? parsed.step : 'scenery',
          preferences: { ...defaultPreferences, ...parsed.preferences },
          results: Array.isArray(parsed.results) ? parsed.results : [],
          compareIds: Array.isArray(parsed.compareIds) ? parsed.compareIds : [],
        };
      }
    }
  } catch (e) {
    console.warn('Could not read chat from sessionStorage:', e);
  }
  return {
    step: 'scenery',
    preferences: { ...defaultPreferences },
    results: [],
    compareIds: [],
  };
}

const initialState = loadInitialChat();

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
      if (action.payload === 'result') {
        state.results = calculateMatchScores(state.preferences, 'all');
      }
      saveToSession(state);
    },

    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      if (state.step === 'result' || action.payload.calculate) {
        state.results = calculateMatchScores(state.preferences, 'all');
      }
      saveToSession(state);
    },

    setCompareIds: (state, action) => {
      state.compareIds = action.payload.slice(0, 3);
      saveToSession(state);
    },

    restartChat: (state) => {
      state.step = 'scenery';
      state.preferences = { ...defaultPreferences };
      state.results = [];
      state.compareIds = [];
      try {
        sessionStorage.removeItem(SESSION_KEY_CHAT);
      } catch (e) {
        console.warn('SessionStorage remove error:', e);
      }
    },

    goBackStep: (state) => {
      const idx = VALID_STEPS.indexOf(state.step);
      if (idx > 0) state.step = VALID_STEPS[idx - 1];
      saveToSession(state);
    },
  },
});

function saveToSession(state) {
  try {
    sessionStorage.setItem(SESSION_KEY_CHAT, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save chat to sessionStorage:', e);
  }
}

export const {
  setStep,
  updatePreferences,
  restartChat,
  setCompareIds,
  goBackStep,
} = chatSlice.actions;

export const selectChatStep = (state) => state.chat.step;
export const selectChatPreferences = (state) => state.chat.preferences;
export const selectChatResults = (state) => state.chat.results;
export const selectCompareIds = (state) => state.chat.compareIds;

export default chatSlice.reducer;
