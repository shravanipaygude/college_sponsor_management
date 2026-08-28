import { createSlice } from "@reduxjs/toolkit";
import {
  sponsorshipPostsForBrand,
  brandOpportunitiesForCommittee,
} from "../../data/mockData.js";


// Experiment 3 — Redux Toolkit Sponsorship Marketplace Slice
// Manages shared sponsorship posts (Committee -> Sponsor) and brand opportunities (Sponsor -> Committee).

// Format initial sponsorship posts from mock data
const initialPosts = sponsorshipPostsForBrand.map((post) => ({
  id: post.id,
  committeeId: post.committeeId || 1,
  committeeName: post.committeeName || "CSI Student Chapter",
  collegeName: post.collegeName || "VESIT",
  collegeLogo: post.collegeLogo || "VE",
  eventName: post.eventName,
  eventType: post.eventType,
  eventDate: post.eventDate,
  participants: post.participants,
  participantsNumeric: post.participantsNumeric || 500,
  lookingFor: post.lookingFor || [],
  canOffer: post.canOffer || [],
  sponsorshipNeeded: post.sponsorshipNeeded || "Hybrid",
  brandsInterested: post.brandsInterested || 12,
  status: post.status || "Active",
  createdAt: post.createdAt || "2 weeks ago",
}));

// Format initial brand opportunities from mock data
const initialOpportunities = brandOpportunitiesForCommittee.map((opp) => {
  const lookingForList = opp.lookingFor || opp.expectations || [];
  const canProvideList = (opp.canProvide || []).map((item) =>
    typeof item === "string" ? item : item.item || item.name || String(item)
  );
  return {
    id: opp.id,
    sponsorId: opp.sponsorId || 1,
    brandName: opp.brandName,
    brandLogo: opp.brandLogo || "NA",
    tagline: opp.tagline || "OPEN FOR COLLEGE SPONSORSHIPS",
    industry: opp.industry || "AI / Technology",
    contributionType: opp.contributionType || "Hybrid",
    estimatedValue: opp.estimatedValue || "₹50,000",
    estimatedValueNumeric: opp.estimatedValueNumeric || 50000,
    interestedIn: opp.interestedIn || [],
    canProvide: canProvideList,
    expectations: lookingForList,
    lookingFor: lookingForList,
    about: opp.about || `${opp.brandName} is looking to support college events.`,
    status: opp.status || "Active",
    responses: opp.responses || 6,
    createdAt: opp.createdAt || "2 weeks ago",
  };
});

const sponsorshipSlice = createSlice({
  name: "sponsorship",
  initialState: {
    posts: initialPosts,
    opportunities: initialOpportunities,
  },
  reducers: {
    addSponsorshipPost: (state, action) => {
      const newPost = {
        id: state.posts.length > 0 ? Math.max(...state.posts.map((p) => p.id)) + 1 : 1,
        committeeId: action.payload.committeeId || 1,
        committeeName: action.payload.committeeName || "CSI Student Chapter",
        collegeName: action.payload.collegeName || "VESIT",
        collegeLogo: action.payload.collegeLogo || "VE",
        eventName: action.payload.eventName,
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
        monetaryRange: action.payload.monetaryRange || null,
        productsDetails: action.payload.productsDetails || null,
        serviceDetails: action.payload.serviceDetails || null,
      };
      state.posts.unshift(newPost);
    },
    addBrandOpportunity: (state, action) => {
      const expectationsList =
        action.payload.expectations || action.payload.lookingFor || [];
      const canProvideList = (action.payload.canProvide || []).map((item) =>
        typeof item === "string" ? item : item.item || item.name || String(item)
      );

      const newOpp = {
        id: state.opportunities.length > 0 ? Math.max(...state.opportunities.map((o) => o.id)) + 1 : 1,
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
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.brandsInterested = (post.brandsInterested || 0) + 1;
      }
    },
    incrementOpportunityResponses: (state, action) => {
      const opp = state.opportunities.find((o) => o.id === action.payload);
      if (opp) {
        opp.responses = (opp.responses || 0) + 1;
      }
    },
  },
});

export const {
  addSponsorshipPost,
  addBrandOpportunity,
  incrementBrandsInterested,
  incrementOpportunityResponses,
} = sponsorshipSlice.actions;

export default sponsorshipSlice.reducer;
