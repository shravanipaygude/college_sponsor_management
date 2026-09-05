import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  api,
  mapEventToPost,
  mapPostToEventPayload,
  mapOpportunityToUI,
  mapOpportunityPayload,
} from "../../services/api.js";

// Async thunks for backend MongoDB synchronization
export const fetchEventsThunk = createAsyncThunk(
  "sponsorship/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const events = await api.getEvents();
      return events.map(mapEventToPost).filter(Boolean);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createEventThunk = createAsyncThunk(
  "sponsorship/createEvent",
  async (postData, { rejectWithValue }) => {
    try {
      const payload = mapPostToEventPayload(postData);
      const createdEvent = await api.createEvent(payload);
      const mappedPost = mapEventToPost(createdEvent);
      return { ...mappedPost, ...postData, id: mappedPost.id, _id: mappedPost._id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOpportunitiesThunk = createAsyncThunk(
  "sponsorship/fetchOpportunities",
  async (_, { rejectWithValue }) => {
    try {
      const opps = await api.getOpportunities();
      return opps.map(mapOpportunityToUI).filter(Boolean);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createOpportunityThunk = createAsyncThunk(
  "sponsorship/createOpportunity",
  async (oppData, { rejectWithValue }) => {
    try {
      const payload = mapOpportunityPayload(oppData);
      const createdOpp = await api.createOpportunity(payload);
      const mappedOpp = mapOpportunityToUI(createdOpp);
      return { ...mappedOpp, ...oppData, id: mappedOpp.id, _id: mappedOpp._id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateEventThunk = createAsyncThunk(
  "sponsorship/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const payload = mapPostToEventPayload(eventData);
      const updated = await api.updateEvent(id, payload);
      const mapped = mapEventToPost(updated);
      return { ...mapped, ...eventData, id: id, _id: id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteEventThunk = createAsyncThunk(
  "sponsorship/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteEvent(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOpportunityThunk = createAsyncThunk(
  "sponsorship/updateOpportunity",
  async ({ id, oppData }, { rejectWithValue }) => {
    try {
      const payload = mapOpportunityPayload(oppData);
      const updated = await api.updateOpportunity(id, payload);
      const mapped = mapOpportunityToUI(updated);
      return { ...mapped, ...oppData, id: id, _id: id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOpportunityThunk = createAsyncThunk(
  "sponsorship/deleteOpportunity",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteOpportunity(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const sponsorshipSlice = createSlice({
  name: "sponsorship",
  initialState: {
    posts: [],
    opportunities: [],
    loading: false,
    error: null,
  },
  reducers: {
    addSponsorshipPost: (state, action) => {
      const matchId = String(action.payload._id || action.payload.id);
      const existingIdx = state.posts.findIndex((p) => String(p._id || p.id) === matchId);
      if (existingIdx >= 0) {
        state.posts[existingIdx] = action.payload;
        return;
      }
      const newPost = {
        id: action.payload.id || (state.posts.length > 0 ? Math.max(...state.posts.map((p) => typeof p.id === 'number' ? p.id : 0)) + 1 : 1),
        committeeId: action.payload.committeeId || 1,
        committeeName: action.payload.committeeName || "CSI Student Chapter",
        collegeName: action.payload.collegeName || "VESIT",
        collegeLogo: action.payload.collegeLogo || "VE",
        eventName: action.payload.eventName || action.payload.title,
        eventType: action.payload.eventType || "Technical Festival",
        eventDate: action.payload.eventDate || "TBD",
        participants: action.payload.participants || "500+",
        participantsNumeric: action.payload.participantsNumeric || 500,
        lookingFor: action.payload.lookingFor || action.payload.requirements || [],
        canOffer: action.payload.canOffer || action.payload.committeeOffers || [],
        sponsorshipNeeded: action.payload.contributionTypes?.[0] || "Hybrid",
        brandsInterested: 0,
        status: "Active",
        createdAt: "Just now",
      };
      state.posts.unshift(newPost);
    },
    addBrandOpportunity: (state, action) => {
      const matchId = String(action.payload._id || action.payload.id);
      const existingIdx = state.opportunities.findIndex((o) => String(o._id || o.id) === matchId);
      if (existingIdx >= 0) {
        state.opportunities[existingIdx] = action.payload;
        return;
      }
      const expectationsList =
        action.payload.expectations || action.payload.lookingFor || [];
      const canProvideList = (action.payload.canProvide || []).map((item) =>
        typeof item === "string" ? item : item.item || item.name || String(item)
      );

      const newOpp = {
        id: action.payload.id || (state.opportunities.length > 0 ? Math.max(...state.opportunities.map((o) => typeof o.id === 'number' ? o.id : 0)) + 1 : 1),
        sponsorId: action.payload.sponsorId || 1,
        brandName: action.payload.brandName || "NovaAI Technologies",
        brandLogo: action.payload.brandLogo || "NA",
        tagline: action.payload.tagline || "OPEN FOR COLLEGE SPONSORSHIPS",
        industry: action.payload.industry || "AI / Technology",
        contributionType: action.payload.selectedContributionType || action.payload.contributionType || "Hybrid",
        estimatedValue: action.payload.estimatedValue || "₹50,000",
        estimatedValueNumeric: action.payload.estimatedValueNumeric || 50000,
        interestedIn: action.payload.interestedIn || [],
        canProvide: canProvideList,
        expectations: expectationsList,
        lookingFor: expectationsList,
        about: action.payload.about || action.payload.description || "",
        status: "Active",
        responses: 0,
        createdAt: "Just now",
      };
      state.opportunities.unshift(newOpp);
    },
    incrementBrandsInterested: (state, action) => {
      const post = state.posts.find((p) => String(p.id) === String(action.payload));
      if (post) {
        post.brandsInterested = (post.brandsInterested || 0) + 1;
      }
    },
    incrementOpportunityResponses: (state, action) => {
      const opp = state.opportunities.find((o) => String(o.id) === String(action.payload));
      if (opp) {
        opp.responses = (opp.responses || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const uniquePosts = [];
        const seenIds = new Set();
        (action.payload || []).forEach((post) => {
          const idStr = String(post._id || post.id);
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            uniquePosts.push(post);
          }
        });
        state.posts = uniquePosts;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createEventThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const existingIndex = state.posts.findIndex((p) => String(p._id || p.id) === matchId);
        if (existingIndex >= 0) {
          state.posts[existingIndex] = action.payload;
        } else {
          state.posts.unshift(action.payload);
        }
      })

      // Fetch Opportunities
      .addCase(fetchOpportunitiesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpportunitiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        const uniqueOpps = [];
        const seenIds = new Set();
        (action.payload || []).forEach((opp) => {
          const idStr = String(opp._id || opp.id);
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            uniqueOpps.push(opp);
          }
        });
        state.opportunities = uniqueOpps;
      })
      .addCase(fetchOpportunitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Opportunity
      .addCase(createOpportunityThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const existingIndex = state.opportunities.findIndex((o) => String(o._id || o.id) === matchId);
        if (existingIndex >= 0) {
          state.opportunities[existingIndex] = action.payload;
        } else {
          state.opportunities.unshift(action.payload);
        }
      })

      // Update Event
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const index = state.posts.findIndex((p) => String(p._id || p.id) === matchId);
        if (index >= 0) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
        }
      })

      // Delete Event
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload);
        state.posts = state.posts.filter((p) => String(p._id || p.id) !== matchId);
      })

      // Update Opportunity
      .addCase(updateOpportunityThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const index = state.opportunities.findIndex((o) => String(o._id || o.id) === matchId);
        if (index >= 0) {
          state.opportunities[index] = { ...state.opportunities[index], ...action.payload };
        }
      })

      // Delete Opportunity
      .addCase(deleteOpportunityThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload);
        state.opportunities = state.opportunities.filter((o) => String(o._id || o.id) !== matchId);
      });
  },
});

export const {
  addSponsorshipPost,
  addBrandOpportunity,
  incrementBrandsInterested,
  incrementOpportunityResponses,
} = sponsorshipSlice.actions;

export default sponsorshipSlice.reducer;
