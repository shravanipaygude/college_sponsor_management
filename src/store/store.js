import { configureStore } from "@reduxjs/toolkit";
import sponsorshipReducer from "./slices/sponsorshipSlice.js";
import requestReducer from "./slices/requestSlice.js";
import partnershipReducer from "./slices/partnershipSlice.js";
import notificationReducer from "./slices/notificationSlice.js";

// Experiment 3 — Redux Store Configuration & Optional Local Persistence
// Load persisted marketplace state from localStorage if present
const LOCAL_STORAGE_KEY = "sponsorflow_redux_marketplace_state";

const loadState = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return undefined;
    }
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    const serializedState = JSON.stringify({
      sponsorship: state.sponsorship,
      requests: state.requests,
      partnerships: state.partnerships,
      notifications: state.notifications,
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
};


const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    sponsorship: sponsorshipReducer,
    requests: requestReducer,
    partnerships: partnershipReducer,
    notifications: notificationReducer,
  },
  preloadedState,
});

// Subscribe to store updates to persist state across sessions (logout/login)
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
