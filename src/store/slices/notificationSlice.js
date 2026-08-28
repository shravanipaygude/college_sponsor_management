import { createSlice } from "@reduxjs/toolkit";
import { notificationsData } from "../../data/mockData.js";


// Experiment 3 — Redux Toolkit Notification Slice
// Manages real-time frontend notifications dispatched across role actions.

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [
      ...notificationsData.committee.map((n) => ({ ...n, role: "Committee Head" })),
      ...notificationsData.sponsor.map((n) => ({ ...n, role: "Corporate Sponsor" })),
      ...notificationsData.faculty.map((n) => ({ ...n, role: "Faculty Approver" })),
    ],
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: state.items.length > 0 ? Math.max(...state.items.map((n) => n.id)) + 1 : 1,
        role: action.payload.role || "Committee Head", // Target role or user
        title: action.payload.title || "Marketplace Notification",
        message: action.payload.message || "",
        time: "Just now",
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
      const roleFilter = action.payload;
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
