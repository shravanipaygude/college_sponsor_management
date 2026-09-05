import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Eye, Send, Tag, Bookmark, X, SlidersHorizontal, Check } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import { incrementOpportunityResponses, fetchOpportunitiesThunk } from "../../store/slices/sponsorshipSlice";
import { createPartnershipRequest, createPartnershipRequestThunk } from "../../store/slices/requestSlice";
import { addNotification } from "../../store/slices/notificationSlice";
import SendPartnershipRequestModal from "./SendPartnershipRequestModal";
import Modal from "../common/Modal";

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
 * DiscoverSponsors — Connected to Redux store.
 * Displays brand opportunities published by Corporate Sponsors.
 * Restyled with global Light/Dark CSS theme variables.
 */
export default function DiscoverSponsors() {
  const dispatch = useDispatch();
  const brandOpportunities = useSelector((state) => state.sponsorship.opportunities);
  const requests = useSelector((state) => state.requests.items);

  useEffect(() => {
    dispatch(fetchOpportunitiesThunk());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [contributionFilter, setContributionFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [valueFilter, setValueFilter] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedOppForModal, setSelectedOppForModal] = useState(null);
  const [selectedOppForViewDetails, setSelectedOppForViewDetails] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { user } = useAuth();

  const { toggleSaved, isSaved } = useSavedItems(
    user ? `sf_saved_sponsors_${user.id}` : null
  );

  const isBrandApproached = (opp) => {
    if (!user) return false;
    const currentUserId = String(user._id || user.id || "");
    const targetOppId = String(opp._id || opp.id || "");

    if (!currentUserId || !targetOppId) return false;

    return requests.some((r) => {
      const reqSender = String(r.sender?._id || r.sender || r.senderId || "");
      const reqOpp = String(r.opportunity?._id || r.opportunity || r.opportunityId || "");

      if (!reqSender || !reqOpp) return false;

      const isSenderMatch = reqSender === currentUserId;
      const isOppMatch = reqOpp === targetOppId;
      const isPendingOrAccepted = (r.status || "").toLowerCase() === "pending" || (r.status || "").toLowerCase() === "accepted";

      return isSenderMatch && isOppMatch && isPendingOrAccepted;
    });
  };

  const handleSendModalSubmit = (formData) => {
    const opp = selectedOppForModal;
    if (!opp) return;

    const brandName = opp.brandName || "Brand";
    const brandLogo = opp.brandLogo || "NA";
    const eventObj = formData.event;

    const requestPayload = {
      opportunityId: opp._id || opp.id,
      opportunityTitle: opp.tagline || `${brandName} Sponsorship Program`,
      sponsorshipPostId: eventObj._id || eventObj.id,
      eventId: eventObj._id || eventObj.id,
      eventName: eventObj.eventName || eventObj.title || eventObj.name || "College Event",
      collegeName: user?.collegeName || user?.college || "VESIT",
      collegeLogo: "VE",
      sender: user?._id || user?.id,
      senderId: user?._id || user?.id,
      senderName: user?.organizationName || user?.committee || user?.name || "College Committee",
      senderRole: "committee",
      receiver: opp.createdBy ? (opp.createdBy._id || opp.createdBy) : opp.sponsorId,
      receiverId: opp.createdBy ? (opp.createdBy._id || opp.createdBy) : opp.sponsorId,
      receiverName: brandName,
      receiverRole: "sponsor",
      brandName: brandName,
      brandLogo: brandLogo,
      requesting: formData.requesting,
      theyOffer: formData.offering,
      offering: formData.requesting.join(" + "),
      interestedIn: formData.offering,
      estimatedValue: opp.estimatedValue || "₹50,000",
      message: formData.message || `Partnership request to ${brandName} for ${eventObj.eventName || eventObj.title || "event"}.`,
      status: "Pending",
    };

    dispatch(createPartnershipRequestThunk(requestPayload));
    dispatch(createPartnershipRequest(requestPayload));

    dispatch(incrementOpportunityResponses(opp.id));

    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Partnership Request Sent",
        message: `Approached ${brandName} for ${eventObj.name}.`,
      })
    );

    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "New Incoming Request",
        message: `VESIT CSI Student Chapter approached ${brandName} for ${eventObj.name}.`,
      })
    );

    setSelectedOppForModal(null);
    setFeedbackMessage(`Partnership request sent to ${brandName}.`);
    setTimeout(() => setFeedbackMessage(""), 5000);
  };

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

  const filtered = brandOpportunities.filter((opp) => {
    if (contributionFilter !== "All") {
      const target = contributionFilter.toLowerCase();
      const oppType = (opp.contributionType || "").toLowerCase();
      const canProvideText = (opp.canProvide || [])
        .map((c) => (typeof c === "string" ? c : c.item || c.type || ""))
        .join(" ")
        .toLowerCase();
      const combinedType = `${oppType} ${canProvideText}`;

      if (target.includes("monetary") && !combinedType.includes("monetary")) return false;
      if (target.includes("product") && !combinedType.includes("product") && !combinedType.includes("in-kind")) return false;
      if (target.includes("digital") && !combinedType.includes("digital") && !combinedType.includes("service")) return false;
      if (target.includes("hybrid") && !combinedType.includes("hybrid")) return false;
    }

    if (industryFilter !== "All") {
      const oppInd = (opp.industry || opp.category || "").toLowerCase();
      const targetInd = industryFilter.toLowerCase();
      if (!oppInd.includes(targetInd) && !targetInd.includes(oppInd)) return false;
    }

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
      const matched = (opp.interestedIn || []).length === 0 || (opp.interestedIn || []).some((item) =>
        terms.some((t) => (item || "").toLowerCase().includes(t.toLowerCase()))
      );
      if (!matched) return false;
    }

    if (valueFilter !== 0) {
      const range = valueFilters[valueFilter];
      const rawValStr = String(opp.estimatedValue || opp.amountOrValue || "50000").replace(/[^0-9]/g, "");
      const val = parseInt(rawValStr, 10) || opp.estimatedValueNumeric || 50000;
      if (val < range.min || val > range.max) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const canProvideStrings = (opp.canProvide || []).map((item) =>
        typeof item === "string" ? item : item.item || ""
      );
      const lookingForStrings = opp.lookingFor || opp.expectations || [];
      const searchable = [
        opp.brandName,
        opp.tagline,
        opp.category,
        opp.industry,
        opp.contributionType,
        ...canProvideStrings,
        ...(opp.interestedIn || []),
        ...lookingForStrings,
      ]
        .filter(Boolean)
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
          Contribution Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {contributionFilters.map((f) => (
            <button
              key={f}
              onClick={() => setContributionFilter(f)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                contributionFilter === f
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
          Industry
        </p>
        <div className="flex flex-wrap gap-1.5">
          {industryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setIndustryFilter(f)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                industryFilter === f
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f !== "All" && <Tag className="w-3 h-3" />}
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">
          Interested Event Type
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
          Estimated Partnership Value
        </p>
        <div className="flex flex-wrap gap-1.5">
          {valueFilters.map((f, idx) => (
            <button
              key={f.label}
              onClick={() => setValueFilter(idx)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                valueFilter === idx
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
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
      {feedbackMessage && (
        <div className="bg-[var(--brand-primary)] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between border border-[var(--border-strong)]">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage("")}
            className="text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Discover Sponsors</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Browse brand sponsorship opportunities</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search sponsors or opportunities..."
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

      {/* Brand Opportunity Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((opp) => {
            const isApproached = isBrandApproached(opp);
            return (
              <div
                key={opp.id}
                className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all duration-200 flex flex-col overflow-hidden"
              >
                <div className="p-5 space-y-4 flex-1">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm border border-[var(--border-strong)]">
                        {opp.brandLogo || "NA"}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[var(--text-primary)]">{opp.brandName}</h3>
                        <p className="text-[10px] font-mono text-[var(--brand-royal)] font-bold uppercase tracking-wider">
                          {opp.tagline || "OPEN FOR COLLEGE SPONSORSHIPS"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaved(opp.id)}
                      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSaved(opp.id)
                          ? "text-[var(--accent-pink)] bg-[var(--accent-pink-bg)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)]"
                      }`}
                      title={isSaved(opp.id) ? "Saved" : "Save Sponsor"}
                    >
                      <Bookmark
                        className={`w-4.5 h-4.5 ${isSaved(opp.id) ? "fill-[var(--accent-pink)]" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Interested In */}
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Interested In</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(opp.interestedIn || []).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Can Provide */}
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Can Provide</p>
                    <ul className="space-y-1">
                      {(opp.canProvide || []).map((item, i) => {
                        const text = typeof item === "string" ? item : item.item || String(item);
                        return (
                          <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                            {text}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Estimated Value */}
                  <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-3.5 py-2.5 border border-[var(--border-subtle)]">
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Value</p>
                    <p className="text-lg font-black text-[var(--text-primary)]">{opp.estimatedValue || "₹50,000"}</p>
                  </div>

                  {/* Looking For */}
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Looking For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(opp.lookingFor || opp.expectations || []).map((item, i) => (
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
                    onClick={() => setSelectedOppForViewDetails(opp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Opportunity
                  </button>
                  <button
                    onClick={() => setSelectedOppForModal(opp)}
                    disabled={isApproached}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isApproached
                        ? "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] cursor-not-allowed border border-[var(--accent-pink)]/40"
                        : "bg-[var(--brand-primary)] text-white hover:opacity-90 shadow-md"
                    }`}
                  >
                    {isApproached ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--accent-pink)]" />
                        Approached
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-white" />
                        Approach Brand
                      </>
                    )}
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
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No Sponsors Match Your Filters</h3>
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

      {selectedOppForModal && (
        <SendPartnershipRequestModal
          opportunity={selectedOppForModal}
          onClose={() => setSelectedOppForModal(null)}
          onSubmit={handleSendModalSubmit}
        />
      )}

      {/* View Opportunity Modal */}
      <Modal
        isOpen={!!selectedOppForViewDetails}
        onClose={() => setSelectedOppForViewDetails(null)}
        title={selectedOppForViewDetails?.brandName || "Opportunity Details"}
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedOppForViewDetails && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Brand Name</span>
                <span className="font-semibold">{selectedOppForViewDetails.brandName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Industry</span>
                <span className="font-semibold">{selectedOppForViewDetails.industry || "AI / Technology"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Contribution Type</span>
                <span className="font-semibold">{selectedOppForViewDetails.contributionType || "Hybrid"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Value</span>
                <span className="font-bold text-[var(--brand-primary)]">{selectedOppForViewDetails.estimatedValue || "₹50,000"}</span>
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">About Sponsorship Program</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedOppForViewDetails.about || selectedOppForViewDetails.description || "Corporate sponsorship opportunity for college events."}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">What They Provide</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedOppForViewDetails.canProvide || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {typeof item === 'string' ? item : item.item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">Their Expectations</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedOppForViewDetails.expectations || selectedOppForViewDetails.lookingFor || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOppForViewDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
