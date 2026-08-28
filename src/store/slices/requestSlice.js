import { createSlice } from "@reduxjs/toolkit";
import {
  committeeIncomingRequests,
  brandIncomingRequests,
} from "../../data/mockData.js";

// Experiment 3 — Redux Toolkit Request Slice
// Manages partnership interest requests sent between Sponsors and Committees (both directions).

// Direction 1: Sponsor -> Committee requests (Sponsor expressing interest in Committee event)
const initialCommitteeRequests = committeeIncomingRequests.map((req) => ({
  id: req.id,
  sponsorshipPostId: req.sponsorshipPostId || req.id,
  opportunityId: null,
  opportunityTitle: null,
  eventName: req.eventName,
  collegeName: req.collegeName || "VESIT",
  collegeLogo: req.collegeLogo || "VE",
  senderId: req.senderId || (req.brandName === "TechVault" ? "demo_sponsor_2" : req.brandName === "FitFuel" ? "demo_sponsor_3" : "demo_sponsor_1"),
  senderName: req.brandName,
  senderRole: "sponsor",
  receiverId: req.receiverId || "demo_committee_1",
  receiverName: "CSI Student Chapter",
  receiverRole: "committee",
  brandName: req.brandName,
  brandLogo: req.brandLogo || "NA",
  offering: req.offering || "₹20,000 + 100 AI Credit Vouchers",
  requesting: Array.isArray(req.offering) ? req.offering : [req.offering],
  interestedIn: req.interestedIn || ["Main Stage Branding", "Product Demo"],
  theyOffer: req.interestedIn || ["Main Stage Branding", "Product Demo"],
  estimatedValue: req.estimatedValue || "₹50,000",
  message: req.message || `${req.brandName} expressed interest in partnering for ${req.eventName}.`,
  status: req.status === "New" ? "Pending" : req.status,
  createdAt: req.receivedAt || "2 hours ago",
  receivedAt: req.receivedAt || "2 hours ago",
}));

// Direction 2: Committee -> Sponsor requests (Committee approaching Brand opportunity)
const initialSponsorRequests = brandIncomingRequests.map((req) => ({
  id: req.id + 100, // Distinct ID range for mock sponsor requests
  sponsorshipPostId: null,
  opportunityId: req.id,
  opportunityTitle: req.opportunityTitle || "Sponsorship Program",
  eventName: req.eventName,
  collegeName: req.collegeName || "VESIT",
  collegeLogo: req.collegeLogo || "VE",
  senderId: "demo_committee_1",
  senderName: req.collegeName ? `${req.collegeName} Committee` : "CSI Student Chapter",
  senderRole: "committee",
  receiverId: "demo_sponsor_1",
  receiverName: "NovaAI Technologies",
  receiverRole: "sponsor",
  brandName: "NovaAI Technologies",
  brandLogo: "NA",
  requesting: req.requesting || ["₹20,000 support", "AI Credits"],
  theyOffer: req.theyOffer || ["Stage Branding", "Instagram Promotion"],
  offering: req.requesting ? req.requesting.join(" + ") : "₹20,000 support",
  interestedIn: req.theyOffer || ["Stage Branding", "Instagram Promotion"],
  estimatedValue: "₹50,000",
  message: `${req.collegeName || "College"} requested sponsorship partnership for ${req.opportunityTitle}`,
  status: req.status === "New" ? "Pending" : req.status,
  createdAt: req.receivedAt || "3 hours ago",
  receivedAt: req.receivedAt || "3 hours ago",
}));

const initialRequests = [...initialCommitteeRequests, ...initialSponsorRequests];

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    items: initialRequests,
  },
  reducers: {
    createPartnershipRequest: (state, action) => {
      const {
        sponsorshipPostId,
        opportunityId,
        senderId,
      } = action.payload;

      // Prevent duplicate active request for exact same sender and target
      const existing = state.items.find((r) => {
        if (r.status !== "Pending" && r.status !== "New") return false;
        if (sponsorshipPostId && r.sponsorshipPostId === sponsorshipPostId && r.senderId === senderId) return true;
        if (opportunityId && r.opportunityId === opportunityId && r.senderId === senderId) return true;
        return false;
      });

      if (existing) {
        return;
      }

      const requestingList = Array.isArray(action.payload.requesting)
        ? action.payload.requesting
        : action.payload.offering
        ? [action.payload.offering]
        : ["Sponsorship Support"];

      const theyOfferList = Array.isArray(action.payload.theyOffer)
        ? action.payload.theyOffer
        : action.payload.interestedIn
        ? action.payload.interestedIn
        : ["Event Branding"];

      const newReq = {
        id: state.items.length > 0 ? Math.max(...state.items.map((r) => r.id)) + 1 : 1,
        sponsorshipPostId: action.payload.sponsorshipPostId || null,
        opportunityId: action.payload.opportunityId || null,
        opportunityTitle: action.payload.opportunityTitle || "Sponsorship Opportunity",
        eventName: action.payload.eventName || "College Event",
        collegeName: action.payload.collegeName || "VESIT",
        collegeLogo: action.payload.collegeLogo || "VE",
        senderId: action.payload.senderId || "demo_committee_1",
        senderName: action.payload.senderName || "CSI Student Chapter",
        senderRole: action.payload.senderRole || "committee",
        receiverId: action.payload.receiverId || "demo_sponsor_1",
        receiverName: action.payload.receiverName || action.payload.brandName || "Corporate Sponsor",
        receiverRole: action.payload.receiverRole || "sponsor",
        brandName: action.payload.brandName || action.payload.receiverName || "Corporate Sponsor",
        brandLogo: action.payload.brandLogo || "NA",
        requesting: requestingList,
        theyOffer: theyOfferList,
        offering: requestingList.join(" + "),
        interestedIn: theyOfferList,
        estimatedValue: action.payload.estimatedValue || "₹50,000",
        message: action.payload.message || `Partnership request for ${action.payload.eventName}`,
        status: "Pending",
        createdAt: "Just now",
        receivedAt: "Just now",
      };

      state.items.unshift(newReq);
    },
    acceptRequest: (state, action) => {
      const request = state.items.find((r) => String(r.id) === String(action.payload));
      if (request) {
        request.status = "Accepted";
      }
    },
    declineRequest: (state, action) => {
      const request = state.items.find((r) => String(r.id) === String(action.payload));
      if (request) {
        request.status = "Declined";
      }
    },
  },
});

export const { createPartnershipRequest, acceptRequest, declineRequest } =
  requestSlice.actions;

export default requestSlice.reducer;
