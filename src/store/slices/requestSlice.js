import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, mapRequestToUI } from "../../services/api.js";
import { createPartnershipThunk } from "./partnershipSlice.js";

// Async thunks for Requests API integration
export const fetchRequestsThunk = createAsyncThunk(
  "requests/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const requests = await api.getRequests();
      return requests.map(mapRequestToUI).filter(Boolean);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPartnershipRequestThunk = createAsyncThunk(
  "requests/createPartnershipRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      // Build MongoDB Request payload
      const payload = {
        sender: requestData.sender || requestData.senderId || null,
        receiver: requestData.receiver || requestData.receiverId || null,
        senderRole: requestData.senderRole || "sponsor",
        receiverRole: requestData.receiverRole || "committee",
        event: requestData.sponsorshipPostId || requestData.eventId || null,
        opportunity: requestData.opportunityId || null,
        message: requestData.message || `Partnership request for ${requestData.eventName || "event"}`,
        supportRequested: Array.isArray(requestData.requesting)
          ? requestData.requesting.join(" + ")
          : requestData.offering || "Sponsorship Support",
        offerDetails: Array.isArray(requestData.theyOffer)
          ? requestData.theyOffer.join(", ")
          : Array.isArray(requestData.interestedIn)
          ? requestData.interestedIn.join(", ")
          : "Event Branding",
        status: "pending",
      };

      const created = await api.createRequest(payload);
      const mapped = mapRequestToUI(created);
      return { ...mapped, ...requestData, id: mapped.id, _id: mapped._id, status: "Pending" };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateRequestStatusThunk = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ requestId, status }, { dispatch, rejectWithValue }) => {
    try {
      const backendStatus = status.toLowerCase() === "accepted" ? "accepted" : "declined";
      const updated = await api.updateRequestStatus(requestId, backendStatus);
      const mapped = mapRequestToUI(updated);
      if (backendStatus === "accepted" && mapped) {
        try {
          const isCommReceiver = mapped.receiverRole === "committee";
          const commId = isCommReceiver ? mapped.receiver : mapped.sender;
          const sponId = isCommReceiver ? mapped.sender : mapped.receiver;
          const partPayload = {
            committee: commId,
            sponsor: sponId,
            requestId: mapped._id || mapped.id || requestId,
            eventId: mapped.eventId || mapped.sponsorshipPostId || null,
            opportunityId: mapped.opportunityId || null,
            eventName: mapped.eventName || "College Event",
            brandProvides: mapped.offering || "Sponsorship Support",
            committeeProvides: mapped.theyOffer || mapped.interestedIn || ["Main Stage Branding"],
          };
          dispatch(createPartnershipThunk(partPayload));
        } catch (partErr) {
          console.error("Failed to auto-create partnership on accept:", partErr);
        }
      }
      return { requestId, mapped, status: status === "accepted" || status === "Accepted" ? "Accepted" : "Declined" };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    createPartnershipRequest: (state, action) => {
      const { sponsorshipPostId, opportunityId, senderId } = action.payload;

      const existing = state.items.find((r) => {
        if (r.status !== "Pending" && r.status !== "New") return false;
        if (sponsorshipPostId && String(r.sponsorshipPostId) === String(sponsorshipPostId) && r.senderId === senderId) return true;
        if (opportunityId && String(r.opportunityId) === String(opportunityId) && r.senderId === senderId) return true;
        return false;
      });

      if (existing) return;

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
        id: action.payload.id || (state.items.length > 0 ? Math.max(...state.items.map((r) => typeof r.id === 'number' ? r.id : 0)) + 1 : 1),
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const uniqueItems = [];
        const seenIds = new Set();
        (action.payload || []).forEach((item) => {
          const idStr = String(item._id || item.id);
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            uniqueItems.push(item);
          }
        });
        state.items = uniqueItems;
      })
      .addCase(fetchRequestsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPartnershipRequestThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const existingIdx = state.items.findIndex((r) => String(r._id || r.id) === matchId);
        if (existingIdx >= 0) {
          state.items[existingIdx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateRequestStatusThunk.fulfilled, (state, action) => {
        const { requestId, status } = action.payload;
        const request = state.items.find((r) => String(r._id || r.id) === String(requestId));
        if (request) {
          request.status = status;
        }
      });
  },
});

export const { createPartnershipRequest, acceptRequest, declineRequest } =
  requestSlice.actions;

export default requestSlice.reducer;
