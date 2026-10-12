import { createSlice } from "@reduxjs/toolkit";

// Experiment 3 / 8 — Redux Toolkit Notification Slice
// Manages real-time frontend notifications dispatched across role actions.
// Mock seed removed in Experiment 8 — all notifications now come from live
// Socket.IO events or explicit in-component dispatches.

/**
 * Format an ISO timestamp into a concise relative or absolute string.
 * Falls back to "Just now" for missing / invalid values.
 * @param {string|null|undefined} timestamp
 * @returns {string}
 */
function formatNotifTime(timestamp) {
  if (!timestamp) return "Just now";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Just now";
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    // Starts empty — populated exclusively by real-time Socket.IO events
    // or explicit in-component dispatches (no mock data).
    items: [],
  },
  reducers: {
    addNotification: (state, action) => {
      // Derive a safe, monotonically-increasing id even from an empty list
      const maxId = state.items.length > 0
        ? Math.max(...state.items.map((n) => n.id ?? 0))
        : 0;

      const newNotification = {
        id: maxId + 1,
        role: action.payload.role || "Committee Head",
        title: action.payload.title || "Marketplace Notification",
        message: action.payload.message || "",
        // Use the server-supplied timestamp when available; gracefully fall back
        time: formatNotifTime(action.payload.timestamp),
        // Store raw timestamp so callers can reformat if needed
        timestamp: action.payload.timestamp || new Date().toISOString(),
        unread: true,
      };
      state.items.unshift(newNotification);
    },

    markNotificationAsRead: (state, action) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) {
        notif.unread = false;
      }
    },

    markAllNotificationsAsRead: (state, action) => {
      const roleFilter = action.payload; // optional role string; marks all when omitted
      state.items.forEach((n) => {
        if (!roleFilter || n.role === roleFilter) {
          n.unread = false;
        }
      });
    },
  },
});

export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
