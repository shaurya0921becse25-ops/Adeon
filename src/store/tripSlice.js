import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingPlan: {
    city: 'Shimla',
    days: 3,
    budget: 20000,
    vibe: 'Peaceful',
    group: 'Solo',
    source: 'initial'
  }
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setPendingPlan: (state, action) => {
      state.pendingPlan = { ...state.pendingPlan, ...action.payload };
    },
    clearPendingPlan: (state) => {
      state.pendingPlan = initialState.pendingPlan;
    }
  }
});

export const { setPendingPlan, clearPendingPlan } = tripSlice.actions;
export const selectPendingPlan = (state) => state.trip.pendingPlan;

export default tripSlice.reducer;
