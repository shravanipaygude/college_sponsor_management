import { createSlice } from "@reduxjs/toolkit";
import { committeePartnerships } from "../../data/mockData.js";


// Experiment 3 — Redux Toolkit Partnership Slice
// Manages created partnerships and state transitions (Negotiation, Deal Agreed, Approved, etc.)

const initialPartnerships = committeePartnerships.map((p) => ({
  id: p.id,
  requestId: p.requestId || p.id,
  committeeId: p.committeeId || 1,
  committeeName: p.committeeName || "CSI Student Chapter",
  sponsorId: p.sponsorId || 1,
  sponsorName: p.brandName,
  brandName: p.brandName,
  brandLogo: p.brandLogo || "NA",
  collegeName: p.collegeName || "VESIT",
  collegeLogo: p.collegeLogo || "VE",
  eventName: p.eventName,
  brandOffers: p.brandOffers || ["₹20,000", "100 AI Credit Vouchers"],
  brandProvides: p.brandOffers || ["₹20,000", "100 AI Credit Vouchers"],
  committeeOffers: p.committeeOffers || ["Main Stage Branding", "Instagram Post"],
  committeeProvides: p.committeeOffers || ["Main Stage Branding", "Instagram Post"],
  estimatedValue: p.estimatedValue || "₹50,000",
  status: p.status === "Discussing" ? "Negotiation" : p.status,
  createdAt: p.lastUpdated || "2 hours ago",
  lastUpdated: p.lastUpdated || "2 hours ago",
}));

const partnershipSlice = createSlice({
  name: "partnerships",
  initialState: {
    items: initialPartnerships,
  },
  reducers: {
    createPartnership: (state, action) => {
      // Prevent duplicate partnership for the same requestId or same event + brand
      if (action.payload.requestId) {
        const existing = state.items.find(
          (p) => String(p.requestId) === String(action.payload.requestId)
        );
        if (existing) return;
      }
      const existingMatch = state.items.find(
        (p) =>
          p.eventName === action.payload.eventName &&
          p.brandName === action.payload.brandName
      );
      if (existingMatch) return;

      const newPartnership = {
        id: state.items.length > 0 ? Math.max(...state.items.map((p) => p.id)) + 1 : 1,
        requestId: action.payload.requestId || null,
        committeeId: action.payload.committeeId || 1,
        committeeName: action.payload.committeeName || "CSI Student Chapter",
        sponsorId: action.payload.sponsorId || 1,
        sponsorName: action.payload.brandName || "Corporate Sponsor",
        brandName: action.payload.brandName || "Corporate Sponsor",
        brandLogo: action.payload.brandLogo || "NA",
        collegeName: action.payload.collegeName || "VESIT",
        collegeLogo: action.payload.collegeLogo || "VE",
        eventName: action.payload.eventName,
        brandOffers: action.payload.brandProvides || action.payload.brandOffers || ["Sponsorship Funding"],
        brandProvides: action.payload.brandProvides || action.payload.brandOffers || ["Sponsorship Funding"],
        committeeOffers: action.payload.committeeProvides || action.payload.committeeOffers || ["Stage & Digital Branding"],
        committeeProvides: action.payload.committeeProvides || action.payload.committeeOffers || ["Stage & Digital Branding"],
        estimatedValue: action.payload.estimatedValue || "₹50,000",
        status: action.payload.status || "Negotiation",
        createdAt: "Just now",
        lastUpdated: "Just now",
      };
      state.items.unshift(newPartnership);
    },
    updatePartnershipStatus: (state, action) => {
      const { id, status } = action.payload;
      const partnership = state.items.find((p) => p.id === id);
      if (partnership) {
        partnership.status = status;
        partnership.lastUpdated = "Just now";
      }
    },
  },
});

export const { createPartnership, updatePartnershipStatus } =
  partnershipSlice.actions;

export default partnershipSlice.reducer;
