import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, MapPin, Sparkles, Eye, Settings, Users, PlusCircle } from "lucide-react";
import StatCard from "../common/StatCard";

import { useAuth } from "../../hooks/useAuth";
import { fetchEventsThunk } from "../../store/slices/sponsorshipSlice";
import { fetchRequestsThunk } from "../../store/slices/requestSlice";
import { fetchPartnershipsThunk } from "../../store/slices/partnershipSlice";

export default function CommitteeDashboard({ onNavigate }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchRequestsThunk());
    dispatch(fetchPartnershipsThunk());
  }, [dispatch]);

  const allPosts = useSelector((state) => state.sponsorship.posts) || [];
  const allRequests = useSelector((state) => state.requests.items) || [];
  const allPartnerships = useSelector((state) => state.partnerships.items) || [];

  const userHexId = user ? String(user._id || user.id || "") : "";
  const userOrg = user ? (user.organizationName || user.committee || "").toLowerCase().trim() : "";

  const myEvents = allPosts.filter((e) => {
    if (!user) return false;
    const createdByHex = e.createdBy ? String(e.createdBy._id || e.createdBy) : null;
    if (createdByHex && userHexId && createdByHex === userHexId) return true;
    const commName = (e.committeeName || e.committee || "").toLowerCase().trim();
    return commName && userOrg && commName === userOrg;
  });

  const myRequests = allRequests.filter((r) => {
    if (!user) return false;
    const receiverHex = r.receiver ? String(r.receiver._id || r.receiver) : null;
    if (receiverHex && userHexId && receiverHex === userHexId) return true;
    const receiverIdStr = r.receiverId ? String(r.receiverId) : null;
    if (receiverIdStr && userHexId && receiverIdStr === userHexId) return true;
    const commName = (r.committeeName || r.receiverName || "").toLowerCase().trim();
    return commName && userOrg && commName === userOrg;
  });

  const myPartnerships = allPartnerships.filter((p) => {
    if (!user) return false;
    const committeeHex = p.committee ? String(p.committee._id || p.committee) : null;
    if (committeeHex && userHexId && committeeHex === userHexId) return true;
    const commIdStr = p.committeeId ? String(p.committeeId) : null;
    if (commIdStr && userHexId && commIdStr === userHexId) return true;
    const commName = (p.committeeName || "").toLowerCase().trim();
    return commName && userOrg && commName === userOrg;
  });

  const activeEventsCount = myEvents.length;
  const incomingReqCount = myRequests.length;
  const activePartCount = myPartnerships.length;

  const dynamicStats = [
    { id: 1, title: "Total Events", value: String(activeEventsCount), subtext: "Created by committee", iconName: "Calendar" },
    { id: 2, title: "Incoming Requests", value: String(incomingReqCount), subtext: "From corporate sponsors", iconName: "Inbox" },
    { id: 3, title: "Active Partnerships", value: String(activePartCount), subtext: "Under negotiation or active", iconName: "Handshake" },
  ];

  const featuredEvent = myEvents.length > 0 ? myEvents[0] : null;

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Hero / Event Overview */}
      <div className="bg-[var(--brand-primary)] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[var(--border-strong)] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {featuredEvent ? (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)]" />
                  {featuredEvent.status || "Active"}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {featuredEvent.eventType || featuredEvent.category || "College Event"}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-sans-ui font-extrabold text-white tracking-tight">
                  {featuredEvent.eventName || featuredEvent.title}
                </h2>
                <p className="text-sm text-white/90 mt-1 max-w-xl font-medium">
                  {featuredEvent.description || "Sponsorship event created by committee."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 pt-1">
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                  <Calendar className="w-4 h-4 text-white" />
                  <span>{featuredEvent.eventDate || "Upcoming"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                  <Users className="w-4 h-4 text-white" />
                  <span>{featuredEvent.participants || "500+"} Expected</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate("my_events")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[var(--brand-primary)] hover:bg-white/90 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Manage Events</span>
                </button>
                <button
                  onClick={() => onNavigate("my_events")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-black/25 text-white border border-white/30 hover:bg-black/40 transition-all duration-200 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-white" />
                  <span>View My Events</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-black/25 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider">
                  Committee Event
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-[var(--brand-primary)]">
                  Live
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">
                  {featuredEvent.committeeName || "College Committee"}
                </h3>
                <p className="text-xs text-white/80">
                  {featuredEvent.collegeName || "VESIT"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 text-white mx-auto flex items-center justify-center border border-white/30 shadow-lg">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">No events created yet.</h2>
              <p className="text-xs text-white/80 mt-1 max-w-md mx-auto">
                Create your committee's first sponsorship event to start receiving corporate partner requests.
              </p>
            </div>
            <button
              onClick={() => onNavigate("my_events")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[var(--brand-primary)] hover:bg-white/90 transition-all shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <StatCard stats={dynamicStats} />
    </div>
  );
}
