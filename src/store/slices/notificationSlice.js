import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Experiment 8 — Redux Toolkit Notification Slice
// Manages real-time frontend notifications with MongoDB Atlas persistence + Socket.IO live updates.

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

// Async Thunks for MongoDB backend persistence
export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    return await api.getNotifications();
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId) => {
    await api.markNotificationRead(notificationId);
    return notificationId;
  }
);

export const markAllNotificationsReadThunk = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async () => {
    await api.markAllNotificationsRead();
    return true;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      const payload = action.payload;
      if (!payload) return;

      const notifId = payload._id || payload.id;

      // Duplicate prevention: avoid inserting if already present by _id or id
      if (
        notifId &&
        state.items.some(
          (n) => (n._id && n._id === notifId) || (n.id && n.id === notifId)
        )
      ) {
        return;
      }

      // Safe monotonic numeric id fallback
      const maxId =
        state.items.length > 0
          ? Math.max(
              ...state.items.map((n) =>
                typeof n.id === "number" ? n.id : 0
              )
            )
          : 0;

      const newNotification = {
        id: payload.id || payload._id || maxId + 1,
        _id: payload._id || payload.id || null,
        role: payload.role || "Committee Head",
        title: payload.title || "Marketplace Notification",
        message: payload.message || "",
        time: formatNotifTime(payload.timestamp || payload.createdAt),
        timestamp: payload.timestamp || payload.createdAt || new Date().toISOString(),
        unread:
          payload.read !== undefined
            ? !payload.read
            : payload.unread !== undefined
            ? payload.unread
            : true,
        metadata: payload.metadata || {},
      };

      state.items.unshift(newNotification);
    },

    markNotificationAsRead: (state, action) => {
      const targetId = action.payload;
      const notif = state.items.find(
        (n) => n.id === targetId || n._id === targetId
      );
      if (notif) {
        notif.unread = false;
      }
    },

    markAllNotificationsAsRead: (state, action) => {
      const roleFilter = action.payload;
      state.items.forEach((n) => {
        if (!roleFilter || n.role === roleFilter) {
          n.unread = false;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map((item) => ({
            id: item._id,
            _id: item._id,
            role: item.role,
            title: item.title,
            message: item.message,
            time: formatNotifTime(item.createdAt),
            timestamp: item.createdAt,
            unread: !item.read,
            metadata: item.metadata || {},
          }));
        }
      })
      .addCase(fetchNotificationsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const targetId = action.payload;
        const notif = state.items.find(
          (n) => n.id === targetId || n._id === targetId
        );
        if (notif) {
          notif.unread = false;
        }
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.unread = false;
        });
      });
  },
});

export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
