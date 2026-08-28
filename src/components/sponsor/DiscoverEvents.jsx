import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Eye, Heart, Users, Calendar, Tag, Bookmark, X, SlidersHorizontal, Check } from "lucide-react";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import { createPartnershipRequest } from "../../store/slices/requestSlice";
import { incrementBrandsInterested } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

const eventTypeFilters = [
  "All", "Hackathon", "Technical Festival", "Workshop",
  "Cultural Festival", "Sports", "Entrepreneurship", "Other",
];

const sponsorshipNeededFilters = ["All", "Monetary", "Products", "Digital / Services", "Hybrid"];

const participantFilters = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Under 100", min: 0, max: 100 },
  { label: "100 – 300", min: 100, max: 300 },
  { label: "300 – 500", min: 300, max: 500 },
  { label: "500+", min: 500, max: Infinity },
];

/**
 * DiscoverEvents — Connected to Redux store.
 * Displays sponsorship posts created by Committee Heads.
 * Restyled with global Light/Dark CSS theme variables.
 */
export default function DiscoverEvents() {
  const dispatch = useDispatch();
  const sponsorshipPosts = useSelector((state) => state.sponsorship.posts);
  const requests = useSelector((state) => state.requests.items);

  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [sponsorshipFilter, setSponsorshipFilter] = useState("All");
  const [participantFilter, setParticipantFilter] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user } = useAuth();

  const { toggleSaved, isSaved } = useSavedItems(
    user ? `sf_saved_events_${user.id}` : null
  );

  const hasActiveFilters =
    searchQuery ||
    eventTypeFilter !== "All" ||
    sponsorshipFilter !== "All" ||
    participantFilter !== 0;

  const clearFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("All");
    setSponsorshipFilter("All");
    setParticipantFilter(0);
  };

  const isInterestExpressed = (post) => {
    const currentSponsorId = user?.id || "demo_sponsor_1";

    return requests.some((r) => {
      const isSponsorSender =
        r.senderRole === "sponsor" ||
        r.senderRole === "Corporate Sponsor" ||
        r.senderRole === "brand";

      if (!isSponsorSender) return false;

      const isCurrentSponsor =
        r.senderId === currentSponsorId ||
        (!user?.id && r.senderId === "demo_sponsor_1");

      if (!isCurrentSponsor) return false;

      const isPostMatch =
        (r.sponsorshipPostId && String(r.sponsorshipPostId) === String(post.id)) ||
        (r.eventId && String(r.eventId) === String(post.id));

      if (!isPostMatch) return false;

      return r.status !== "Declined";
    });
  };

  const handleExpressInterest = (post) => {
    const brandName = user?.company || user?.name || "NovaAI Technologies";
    const brandLogo = user?.company ? user.company.substring(0, 2).toUpperCase() : "NA";

    dispatch(
      createPartnershipRequest({
        sponsorshipPostId: post.id,
        eventName: post.eventName,
        collegeName: post.collegeName || "VESIT",
        collegeLogo: post.collegeLogo || "VE",
        senderId: user?.id || "demo_sponsor_1",
        senderName: brandName,
        senderRole: "sponsor",
        receiverId: post.committeeId || "demo_committee_1",
        receiverName: post.collegeName ? `${post.collegeName} Committee` : "CSI Student Chapter",
        receiverRole: "committee",
        brandName: brandName,
        brandLogo: brandLogo,
        offering: "₹20,000 Monetary + 100 AI Credit Vouchers",
        interestedIn: post.canOffer ? post.canOffer.slice(0, 3) : ["Main Stage Branding"],
        requesting: ["Stage Branding", "Instagram Promotion"],
        theyOffer: post.canOffer ? post.canOffer.slice(0, 3) : ["Main Stage Branding"],
        estimatedValue: "₹50,000",
        message: `${brandName} expressed interest in sponsoring ${post.eventName}.`,
        status: "Pending",
      })
    );

    dispatch(incrementBrandsInterested(post.id));

    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Interest Expressed",
        message: `Interest sent to ${post.eventName}.`,
      })
    );

    dispatch(
      addNotification({
        role: "Committee Head",
        title: "New Partnership Interest",
        message: `${brandName} expressed interest in ${post.eventName}.`,
      })
    );

    setToastMessage(`Interest sent successfully to ${post.eventName}!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const filtered = sponsorshipPosts.filter((post) => {
    if (eventTypeFilter !== "All") {
      const typeMatch = post.eventType?.toLowerCase().includes(eventTypeFilter.toLowerCase());
      if (!typeMatch) return false;
    }

    if (sponsorshipFilter !== "All") {
      const typeMap = {
        "Monetary": "Monetary",
        "Products": "Products",
        "Digital / Services": "Digital",
        "Hybrid": "Hybrid",
      };
      if (post.sponsorshipNeeded !== typeMap[sponsorshipFilter]) return false;
    }

    if (participantFilter !== 0) {
      const range = participantFilters[participantFilter];
      const val = post.participantsNumeric || 0;
      if (val < range.min || val > range.max) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = [
        post.eventName,
        post.collegeName,
        post.eventType,
        post.category,
        ...(post.lookingFor || []),
        ...(post.canOffer || []),
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });

  const filterControls = (
    <div className="space-y-4 font-sans-ui">
      <div>
        <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">
          Event Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {eventTypeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setEventTypeFilter(f)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                eventTypeFilter === f
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">
          Sponsorship Needed
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sponsorshipNeededFilters.map((f) => (
            <button
              key={f}
              onClick={() => setSponsorshipFilter(f)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                sponsorshipFilter === f
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">
          Expected Participants
        </p>
        <div className="flex flex-wrap gap-1.5">
          {participantFilters.map((f, idx) => (
            <button
              key={f.label}
              onClick={() => setParticipantFilter(idx)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                participantFilter === idx
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent-pink)] hover:underline cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Discover College Events</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Browse sponsorship posts from college committees</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search events or colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden p-2 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-[var(--bg-card)] p-5 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        {filterControls}
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="sm:hidden bg-[var(--bg-card)] p-5 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
          {filterControls}
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="bg-[var(--brand-primary)] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between border border-[var(--border-strong)]">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage("")} className="text-white/80 hover:text-white p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Event Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const expressed = isInterestExpressed(post);
            return (
              <div
                key={post.id}
                className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Event Header */}
                <div className="bg-[var(--brand-primary)] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                        {post.collegeLogo || "VE"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{post.eventName}</h3>
                        <p className="text-[10px] text-white/80 font-medium">{post.collegeName || "VESIT"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaved(post.id)}
                      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSaved(post.id)
                          ? "text-[var(--accent-pink)] bg-[var(--accent-pink-bg)]"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      title={isSaved(post.id) ? "Saved" : "Save Event"}
                    >
                      <Bookmark
                        className={`w-4.5 h-4.5 ${isSaved(post.id) ? "fill-[var(--accent-pink)]" : ""}`}
                      />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-white/90 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-white" />
                      {post.participants} Expected
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-white" />
                      {post.eventType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-white" />
                      {post.eventDate}
                    </span>
                  </div>
                </div>

                {/* Post Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Looking For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(post.lookingFor || []).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Can Offer</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(post.canOffer || []).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex gap-2">
                  <button
                    onClick={() => alert(`Viewing event: ${post.eventName}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Event
                  </button>
                  <button
                    onClick={() => handleExpressInterest(post)}
                    disabled={expressed}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      expressed
                        ? "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] cursor-not-allowed border border-[var(--accent-pink)]/40"
                        : "bg-[var(--brand-primary)] text-white hover:opacity-90 shadow-md"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    {expressed ? "Interest Expressed" : "Express Interest"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] rounded-3xl p-10 border border-[var(--border-subtle)] text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No Events Match Your Filters</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
            Try changing or clearing your filters to see more results.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
