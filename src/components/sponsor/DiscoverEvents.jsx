import React, { useState } from "react";
import { Search, Eye, Heart, Users, Calendar, Tag, Bookmark, X, SlidersHorizontal } from "lucide-react";
import { sponsorshipPostsForBrand } from "../../data/mockData";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";

// ─── Filter Options ─────────────────────────────────────────

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
 * DiscoverEvents — Enhanced with search, multi-filter, save, and empty states.
 * Uses useState for search query, all filter selections, and interest state.
 * Uses useSavedItems for bookmark functionality.
 */
export default function DiscoverEvents() {
  // useState manages local form and filter state.
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [sponsorshipFilter, setSponsorshipFilter] = useState("All");
  const [participantFilter, setParticipantFilter] = useState(0); // index
  const [expressedInterest, setExpressedInterest] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user } = useAuth();

  // useSavedItems provides reusable save/unsave behavior for events.
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

  // ─── Filtering Logic ────────────────────────────────────────
  const filtered = sponsorshipPostsForBrand.filter((post) => {
    // Event type filter
    if (eventTypeFilter !== "All") {
      const typeMatch = post.eventType.toLowerCase().includes(eventTypeFilter.toLowerCase());
      if (!typeMatch) return false;
    }

    // Sponsorship needed filter
    if (sponsorshipFilter !== "All") {
      const typeMap = {
        "Monetary": "Monetary",
        "Products": "Products",
        "Digital / Services": "Digital",
        "Hybrid": "Hybrid",
      };
      if (post.sponsorshipNeeded !== typeMap[sponsorshipFilter]) return false;
    }

    // Participant range filter
    if (participantFilter !== 0) {
      const range = participantFilters[participantFilter];
      const val = post.participantsNumeric || 0;
      if (val < range.min || val > range.max) return false;
    }

    // Search filter — match across event name, college name, lookingFor, canOffer
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = [
        post.eventName,
        post.collegeName,
        post.eventType,
        post.category,
        ...post.lookingFor,
        ...post.canOffer,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });

  // ─── Filter Controls Component ─────────────────────────────
  const filterControls = (
    <div className="space-y-3">
      {/* Event Type */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Event Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {eventTypeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setEventTypeFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                eventTypeFilter === f
                  ? "bg-espresso text-offWhite shadow-sm"
                  : "bg-white text-darkBrown border border-taupe/30 hover:bg-offWhite"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sponsorship Needed */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Sponsorship Needed
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sponsorshipNeededFilters.map((f) => (
            <button
              key={f}
              onClick={() => setSponsorshipFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                sponsorshipFilter === f
                  ? "bg-taupe text-espresso"
                  : "bg-offWhite text-brown border border-taupe/20 hover:bg-taupe/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Expected Participants */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Expected Participants
        </p>
        <div className="flex flex-wrap gap-1.5">
          {participantFilters.map((f, idx) => (
            <button
              key={f.label}
              onClick={() => setParticipantFilter(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                participantFilter === idx
                  ? "bg-espresso text-offWhite shadow-sm"
                  : "bg-white text-darkBrown border border-taupe/30 hover:bg-offWhite"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-bold text-brown hover:text-espresso transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">Discover College Events</h2>
          <p className="text-xs text-brown mt-1">Browse sponsorship posts from college committees</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
            <input
              type="text"
              placeholder="Search events or colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-lg pl-9 pr-3 py-2 text-xs text-darkBrown placeholder:text-brown/60 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden p-2 rounded-lg bg-offWhite border border-taupe/30 text-brown hover:bg-taupe/20 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white p-5 rounded-2xl border border-taupe/30 shadow-sm">
        {filterControls}
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="sm:hidden bg-white p-5 rounded-2xl border border-taupe/30 shadow-sm">
          {filterControls}
        </div>
      )}

      {/* Event Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Event Header */}
              <div className="bg-espresso p-4 text-offWhite">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                      {post.collegeLogo}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{post.eventName}</h3>
                      <p className="text-[10px] text-taupe font-medium">{post.collegeName}</p>
                    </div>
                  </div>
                  {/* Save/Bookmark Button */}
                  <button
                    onClick={() => toggleSaved(post.id)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isSaved(post.id)
                        ? "text-taupe bg-darkBrown"
                        : "text-taupe/40 hover:text-taupe hover:bg-darkBrown"
                    }`}
                    title={isSaved(post.id) ? "Saved" : "Save Event"}
                  >
                    <Bookmark
                      className={`w-4.5 h-4.5 transition-all ${isSaved(post.id) ? "fill-taupe" : ""}`}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-taupe/90">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {post.participants} Expected
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.eventType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.eventDate}
                  </span>
                </div>
              </div>

              {/* Post Body */}
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.lookingFor.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-offWhite rounded text-[10px] text-darkBrown font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Can Offer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.canOffer.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-taupe/20 flex gap-2">
                <button
                  onClick={() => alert(`Viewing event: ${post.eventName}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Event
                </button>
                <button
                  onClick={() => {
                    setExpressedInterest([...expressedInterest, post.id]);
                    alert(`Interest expressed in ${post.eventName}!`);
                  }}
                  disabled={expressedInterest.includes(post.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    expressedInterest.includes(post.id)
                      ? "bg-taupe/30 text-brown cursor-not-allowed"
                      : "bg-espresso text-offWhite hover:bg-darkBrown"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  {expressedInterest.includes(post.id) ? "Interest Expressed" : "Express Interest"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-10 border border-taupe/30 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-taupe/15 text-brown mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-espresso">No Events Match Your Filters</h3>
          <p className="text-sm text-brown max-w-sm mx-auto">
            Try changing or clearing your filters to see more results.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-taupe text-espresso rounded-xl text-xs font-bold hover:bg-espresso hover:text-offWhite transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
