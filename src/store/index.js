import { configureStore } from '@reduxjs/toolkit';
import communityReducer from './communitySlice';
import chatReducer from './chatSlice';
import tripReducer from './tripSlice';
import servicesReducer from './servicesSlice';

export const store = configureStore({
  reducer: {
    community: communityReducer,
    chat: chatReducer,
    trip: tripReducer,
    services: servicesReducer
  }
});

export default store;
