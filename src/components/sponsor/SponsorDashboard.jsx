import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, Calendar, Users, Eye } from "lucide-react";
import StatCard from "../common/StatCard";
import { useAuth } from "../../hooks/useAuth";
import { fetchEventsThunk, fetchOpportunitiesThunk } from "../../store/slices/sponsorshipSlice";
import { fetchRequestsThunk } from "../../store/slices/requestSlice";
import { fetchPartnershipsThunk } from "../../store/slices/partnershipSlice";

export default function SponsorDashboard({ onNavigate }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchOpportunitiesThunk());
    dispatch(fetchRequestsThunk());
    dispatch(fetchPartnershipsThunk());
  }, [dispatch]);

  const posts = useSelector((state) => state.sponsorship.posts) || [];
  const allOpps = useSelector((state) => state.sponsorship.opportunities) || [];
  const allRequests = useSelector((state) => state.requests.items) || [];
  const allPartnerships = useSelector((state) => state.partnerships.items) || [];

  const userHexId = user ? String(user._id || user.id || "") : "";
  const userOrg = user ? (user.organizationName || user.company || user.name || "").toLowerCase().trim() : "";

  const myOpps = (allOpps || []).filter((o) => {
    if (!user) return false;
    const createdByHex = o.createdBy ? String(o.createdBy._id || o.createdBy) : null;
    if (createdByHex && userHexId && createdByHex === userHexId) return true;
    const compName = (o.companyName || o.brandName || "").toLowerCase().trim();
    return compName && userOrg && compName === userOrg;
  });

  const myRequests = (allRequests || []).filter((r) => {
    if (!user) return false;
    const receiverHex = r.receiver ? String(r.receiver._id || r.receiver) : null;
    if (receiverHex && userHexId && receiverHex === userHexId) return true;
    const receiverIdStr = r.receiverId ? String(r.receiverId) : null;
    if (receiverIdStr && userHexId && receiverIdStr === userHexId) return true;
    const brandStr = (r.brandName || r.receiverName || "").toLowerCase().trim();
    return brandStr && userOrg && brandStr === userOrg;
  });

  const myPartnerships = (allPartnerships || []).filter((p) => {
    if (!user) return false;
    const sponsorHex = p.sponsor ? String(p.sponsor._id || p.sponsor) : null;
    if (sponsorHex && userHexId && sponsorHex === userHexId) return true;
    const sponIdStr = p.sponsorId ? String(p.sponsorId) : null;
    if (sponIdStr && userHexId && sponIdStr === userHexId) return true;
    const brandNameStr = (p.brandName || p.sponsorName || "").toLowerCase().trim();
    return brandNameStr && userOrg && brandNameStr === userOrg;
  });

  const activeOppCount = myOpps.length;
  const incomingReqCount = myRequests.length;
  const activePartCount = myPartnerships.length;

  const dynamicStats = [
    { id: 1, title: "Our Opportunities", value: String(activeOppCount), subtext: "Published brand programs", iconName: "Megaphone" },
    { id: 2, title: "Incoming Requests", value: String(incomingReqCount), subtext: "From college committees", iconName: "Inbox" },
    { id: 3, title: "Active Partnerships", value: String(activePartCount), subtext: "Active discussions", iconName: "Handshake" },
  ];

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Stats */}
      <StatCard stats={dynamicStats} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Events */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recommended College Events</h3>
            <button
              onClick={() => onNavigate("discover_events")}
              className="text-xs font-bold text-[var(--brand-royal)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 5).map((event) => (
              <div key={event._id || event.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-xs border border-[var(--border-strong)]">
                    {(event.collegeName || "VE").substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{event.eventName || event.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                      <span>{event.collegeName || "College"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-[var(--brand-royal)]" />
                        {event.participants || "500+"}
                      </span>
                      <span>•</span>
                      <span>{event.eventType || event.category || "Event"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border border-[var(--accent-pink)]/30">
                    Active
                  </span>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="p-6 text-center text-xs text-[var(--text-secondary)]">
                No college events available for sponsorship yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Partnership Activity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Active Partnerships</h3>
            <div className="space-y-3">
              {myPartnerships.slice(0, 3).map((p) => (
                <div key={p._id || p.id} className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{p.eventName}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{p.collegeName || p.committeeName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--border-subtle)]">
                      {p.status || "Active"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono">Value: {p.estimatedValue || p.estimatedTotalValue || "₹50,000"}</p>
                </div>
              ))}
              {myPartnerships.length === 0 && (
                <div className="p-4 text-center text-xs text-[var(--text-secondary)]">
                  No active sponsorship partnerships found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
