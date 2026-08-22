import React, { useState } from "react";
import { Search, Eye, Send, Tag, Bookmark, X, SlidersHorizontal } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { brandOpportunitiesForCommittee } from "../../data/mockData";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";

// ─── Filter Options ─────────────────────────────────────────

const contributionFilters = ["All", "Monetary", "In-Kind / Products", "Digital / Services", "Hybrid"];

const industryFilters = [
  "All", "AI / Technology", "Education", "Food & Beverage",
  "FinTech", "Software", "Local Business", "Other",
];

const eventTypeFilters = [
  "All", "Hackathons", "Technical Festivals", "Workshops",
  "Cultural Events", "Sports Events", "Entrepreneurship Events",
];

const valueFilters = [
  { label: "Any Value", min: 0, max: Infinity },
  { label: "Under ₹10K", min: 0, max: 10000 },
  { label: "₹10K – ₹25K", min: 10000, max: 25000 },
  { label: "₹25K – ₹50K", min: 25000, max: 50000 },
  { label: "₹50K+", min: 50000, max: Infinity },
];

/**
 * DiscoverSponsors — Enhanced with search, multi-filter, save, and empty states.
 * Uses useState for search query, all filter selections, and approached brands.
 * Uses useSavedItems for bookmark functionality.
 */
export default function DiscoverSponsors() {
  // useState manages local form and filter state.
  const [searchQuery, setSearchQuery] = useState("");
  const [contributionFilter, setContributionFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [valueFilter, setValueFilter] = useState(0); // index into valueFilters
  const [approachedBrands, setApproachedBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user } = useAuth();

  // useSavedItems provides reusable save/unsave behavior for sponsors.
  const { toggleSaved, isSaved } = useSavedItems(
    user ? `sf_saved_sponsors_${user.id}` : null
  );

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery ||
    contributionFilter !== "All" ||
    industryFilter !== "All" ||
    eventTypeFilter !== "All" ||
    valueFilter !== 0;

  const clearFilters = () => {
    setSearchQuery("");
    setContributionFilter("All");
    setIndustryFilter("All");
    setEventTypeFilter("All");
    setValueFilter(0);
  };

  // ─── Filtering Logic ────────────────────────────────────────
  const filtered = brandOpportunitiesForCommittee.filter((opp) => {
    // Contribution type filter
    if (contributionFilter !== "All") {
      const typeMap = {
        "Monetary": "Monetary",
        "In-Kind / Products": "In-Kind",
        "Digital / Services": "Digital",
        "Hybrid": "Hybrid",
      };
      if (opp.contributionType !== typeMap[contributionFilter]) return false;
    }

    // Industry filter
    if (industryFilter !== "All") {
      if (opp.industry !== industryFilter) return false;
    }

    // Event type filter — match against interestedIn array
    if (eventTypeFilter !== "All") {
      const matchTerms = {
        "Hackathons": ["Hackathon", "Hackathons"],
        "Technical Festivals": ["Tech Festival", "Tech Festivals", "Technical"],
        "Workshops": ["Workshop", "Workshops"],
        "Cultural Events": ["Cultural", "Cultural Festival", "Cultural Festivals", "College Festivals"],
        "Sports Events": ["Sports", "Sports Event", "Sports Events"],
        "Entrepreneurship Events": ["Entrepreneurship", "Entrepreneurship Events"],
      };
      const terms = matchTerms[eventTypeFilter] || [eventTypeFilter];
      const matched = opp.interestedIn.some((item) =>
        terms.some((t) => item.toLowerCase().includes(t.toLowerCase()))
      );
      if (!matched) return false;
    }

    // Value range filter
    if (valueFilter !== 0) {
      const range = valueFilters[valueFilter];
      const val = opp.estimatedValueNumeric || 0;
      if (val < range.min || val > range.max) return false;
    }

    // Search filter — match across brand name, tagline, category, industry, canProvide, interestedIn
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = [
        opp.brandName,
        opp.tagline,
        opp.category,
        opp.industry,
        opp.contributionType,
        ...opp.canProvide,
        ...opp.interestedIn,
        ...opp.lookingFor,
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
      {/* Contribution Type */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Contribution Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {contributionFilters.map((f) => (
            <button
              key={f}
              onClick={() => setContributionFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                contributionFilter === f
                  ? "bg-espresso text-offWhite shadow-sm"
                  : "bg-white text-darkBrown border border-taupe/30 hover:bg-offWhite"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Industry
        </p>
        <div className="flex flex-wrap gap-1.5">
          {industryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setIndustryFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                industryFilter === f
                  ? "bg-taupe text-espresso"
                  : "bg-offWhite text-brown border border-taupe/20 hover:bg-taupe/20"
              }`}
            >
              {f !== "All" && <Tag className="w-3 h-3" />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Interested Event Type */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Interested Event Type
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

      {/* Estimated Value */}
      <div>
        <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">
          Estimated Partnership Value
        </p>
        <div className="flex flex-wrap gap-1.5">
          {valueFilters.map((f, idx) => (
            <button
              key={f.label}
              onClick={() => setValueFilter(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                valueFilter === idx
                  ? "bg-taupe text-espresso"
                  : "bg-offWhite text-brown border border-taupe/20 hover:bg-taupe/20"
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
          <h2 className="text-xl font-bold text-espresso tracking-tight">Discover Sponsors</h2>
          <p className="text-xs text-brown mt-1">Browse brand sponsorship opportunities</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
            <input
              type="text"
              placeholder="Search sponsors or opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-lg pl-9 pr-3 py-2 text-xs text-darkBrown placeholder:text-brown/60 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
            />
          </div>
          {/* Mobile filter toggle */}
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

      {/* Mobile Filters (collapsible) */}
      {showMobileFilters && (
        <div className="sm:hidden bg-white p-5 rounded-2xl border border-taupe/30 shadow-sm">
          {filterControls}
        </div>
      )}

      {/* Brand Opportunity Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              <div className="p-5 space-y-4 flex-1">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                      {opp.brandLogo}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-espresso">{opp.brandName}</h3>
                      <p className="text-[10px] text-brown font-semibold uppercase tracking-wider">{opp.tagline}</p>
                    </div>
                  </div>
                  {/* Save/Bookmark Button */}
                  <button
                    onClick={() => toggleSaved(opp.id)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isSaved(opp.id)
                        ? "text-espresso bg-taupe/20"
                        : "text-brown/40 hover:text-brown hover:bg-offWhite"
                    }`}
                    title={isSaved(opp.id) ? "Saved" : "Save Sponsor"}
                  >
                    <Bookmark
                      className={`w-4.5 h-4.5 transition-all ${isSaved(opp.id) ? "fill-espresso" : ""}`}
                    />
                  </button>
                </div>

                {/* Interested In */}
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Interested In</p>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.interestedIn.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-offWhite rounded text-[10px] text-darkBrown font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Can Provide */}
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Can Provide</p>
                  <ul className="space-y-1">
                    {opp.canProvide.map((item, i) => (
                      <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Value */}
                <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20">
                  <p className="text-[10px] font-bold text-brown uppercase">Estimated Value</p>
                  <p className="text-lg font-black text-espresso">{opp.estimatedValue}</p>
                </div>

                {/* Looking For */}
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.lookingFor.map((item, i) => (
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
                  onClick={() => alert(`Viewing full opportunity from ${opp.brandName}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Opportunity
                </button>
                <button
                  onClick={() => {
                    setApproachedBrands([...approachedBrands, opp.id]);
                    alert(`Partnership request sent to ${opp.brandName}!`);
                  }}
                  disabled={approachedBrands.includes(opp.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    approachedBrands.includes(opp.id)
                      ? "bg-taupe/30 text-brown cursor-not-allowed"
                      : "bg-espresso text-offWhite hover:bg-darkBrown"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {approachedBrands.includes(opp.id) ? "Approached" : "Approach Brand"}
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
          <h3 className="text-lg font-bold text-espresso">No Sponsors Match Your Filters</h3>
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
