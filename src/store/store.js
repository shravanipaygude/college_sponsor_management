import { configureStore } from "@reduxjs/toolkit";
import sponsorshipReducer from "./slices/sponsorshipSlice.js";
import requestReducer from "./slices/requestSlice.js";
import partnershipReducer from "./slices/partnershipSlice.js";
import notificationReducer from "./slices/notificationSlice.js";

// Experiment 4 — Redux Store Configuration with MongoDB Backend Persistence
// Remove marketplace localStorage persistence so MongoDB Atlas serves as persistent source of truth.
const LOCAL_STORAGE_KEY = "sponsorflow_redux_marketplace_state";
if (typeof window !== "undefined" && window.localStorage) {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // Ignore storage clear error
  }
}

export const store = configureStore({
  reducer: {
    sponsorship: sponsorshipReducer,
    requests: requestReducer,
    partnerships: partnershipReducer,
    notifications: notificationReducer,
  },
});

export default store;
