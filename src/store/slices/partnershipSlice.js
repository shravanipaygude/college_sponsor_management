import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, mapPartnershipToUI } from "../../services/api.js";

// Async thunks for Partnership API integration
export const fetchPartnershipsThunk = createAsyncThunk(
  "partnerships/fetchPartnerships",
  async (_, { rejectWithValue }) => {
    try {
      const partnerships = await api.getPartnerships();
      return partnerships.map(mapPartnershipToUI).filter(Boolean);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPartnershipThunk = createAsyncThunk(
  "partnerships/createPartnership",
  async (partnershipData, { rejectWithValue }) => {
    try {
      const payload = {
        committee: partnershipData.committee || partnershipData.committeeId || null,
        sponsor: partnershipData.sponsor || partnershipData.sponsorId || null,
        request: partnershipData.requestId || null,
        event: partnershipData.eventId || partnershipData.sponsorshipPostId || null,
        opportunity: partnershipData.opportunityId || null,
        agreementDetails: partnershipData.agreementDetails || `Partnership for ${partnershipData.eventName}`,
        supportProvided: Array.isArray(partnershipData.brandProvides)
          ? partnershipData.brandProvides.join(" + ")
          : partnershipData.brandProvides || "Sponsorship Support",
        deliverables: Array.isArray(partnershipData.committeeProvides)
          ? partnershipData.committeeProvides
          : ["Main Stage Branding"],
        facultyApprovalStatus: "approved",
      };

      const created = await api.createPartnership(payload);
      const mapped = mapPartnershipToUI(created);
      return { ...mapped, ...partnershipData, id: mapped.id, _id: mapped._id };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateFacultyApprovalThunk = createAsyncThunk(
  "partnerships/updateFacultyApproval",
  async ({ partnershipId, facultyApprovalStatus, facultyRemarks, approvedBy }, { rejectWithValue }) => {
    try {
      const backendStatus =
        facultyApprovalStatus.toLowerCase() === "approved"
          ? "approved"
          : facultyApprovalStatus.toLowerCase() === "rejected"
          ? "rejected"
          : "pending";

      const updated = await api.updateFacultyApproval(partnershipId, {
        facultyApprovalStatus: backendStatus,
        facultyRemarks,
        approvedBy,
      });

      const mapped = mapPartnershipToUI(updated);
      return {
        partnershipId,
        mapped,
        status: backendStatus === "approved" ? "Approved" : backendStatus === "rejected" ? "Rejected" : "Awaiting Approval",
        facultyApprovalStatus: backendStatus,
        facultyRemarks: facultyRemarks || "",
        approvedBy: approvedBy || "Faculty Approver",
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const partnershipSlice = createSlice({
  name: "partnerships",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    createPartnership: (state, action) => {
      const matchId = String(action.payload._id || action.payload.id);
      const existingIdx = state.items.findIndex((p) => String(p._id || p.id) === matchId);
      if (existingIdx >= 0) {
        state.items[existingIdx] = action.payload;
        return;
      }
      if (action.payload.requestId) {
        const existing = state.items.find(
          (p) => String(p.requestId) === String(action.payload.requestId)
        );
        if (existing) return;
      }
      state.items.unshift(action.payload);
    },
    updatePartnershipStatus: (state, action) => {
      const { id, status, facultyRemarks, approvedBy } = action.payload;
      const partnership = state.items.find((p) => String(p._id || p.id) === String(id));
      if (partnership) {
        partnership.status = status;
        if (facultyRemarks !== undefined) {
          partnership.facultyRemarks = facultyRemarks;
          partnership.remarks = facultyRemarks;
        }
        if (approvedBy) {
          partnership.approvedBy = approvedBy;
        }
        partnership.lastUpdated = "Just now";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnershipsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartnershipsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Deduplicate fetched items by _id
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
      .addCase(fetchPartnershipsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPartnershipThunk.fulfilled, (state, action) => {
        const matchId = String(action.payload._id || action.payload.id);
        const existingIdx = state.items.findIndex((p) => String(p._id || p.id) === matchId);
        if (existingIdx >= 0) {
          state.items[existingIdx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateFacultyApprovalThunk.fulfilled, (state, action) => {
        const { partnershipId, status, facultyApprovalStatus, facultyRemarks, approvedBy } = action.payload;
        const partnership = state.items.find((p) => String(p._id || p.id) === String(partnershipId));
        if (partnership) {
          partnership.status = status;
          partnership.facultyApprovalStatus = facultyApprovalStatus;
          partnership.facultyRemarks = facultyRemarks;
          partnership.remarks = facultyRemarks;
          partnership.approvedBy = approvedBy;
          partnership.lastUpdated = "Just now";
        }
      });
  },
});

export const { createPartnership, updatePartnershipStatus } =
  partnershipSlice.actions;

export default partnershipSlice.reducer;
