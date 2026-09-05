import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bookmark, Eye, Send, Building2, Tag } from "lucide-react";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import SendPartnershipRequestModal from "./SendPartnershipRequestModal";
import Modal from "../common/Modal";
import { createPartnershipRequest, createPartnershipRequestThunk } from "../../store/slices/requestSlice";
import { incrementOpportunityResponses } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function SavedSponsors() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const brandOpportunities = useSelector((state) => state.sponsorship.opportunities);

  const { savedIds, toggleSaved } = useSavedItems(
    user ? `sf_saved_sponsors_${user.id}` : null
  );

  const savedSponsors = brandOpportunities.filter((opp) => savedIds.includes(opp.id));

  const [selectedOppForModal, setSelectedOppForModal] = useState(null);
  const [selectedOppForViewDetails, setSelectedOppForViewDetails] = useState(null);

  const handleSendModalSubmit = (formData) => {
    const opp = selectedOppForModal;
    if (!opp) return;

    const brandName = opp.brandName || "Brand";
    const brandLogo = opp.brandLogo || "NA";
    const eventObj = formData.event;

    const requestPayload = {
      opportunityId: opp._id || opp.id,
      opportunityTitle: opp.tagline || `${brandName} Sponsorship Program`,
      eventId: eventObj.id,
      eventName: eventObj.name,
      collegeName: user?.college || "VESIT",
      collegeLogo: "VE",
      senderId: user?.id || "demo_committee_1",
      senderName: user?.committee || user?.name || "CSI Student Chapter",
      senderRole: "committee",
      receiverId: opp.sponsorId || "demo_sponsor_1",
      receiverName: brandName,
      receiverRole: "sponsor",
      brandName: brandName,
      brandLogo: brandLogo,
      requesting: formData.requesting,
      theyOffer: formData.offering,
      offering: formData.requesting.join(" + "),
      interestedIn: formData.offering,
      estimatedValue: opp.estimatedValue || "₹50,000",
      message: formData.message || `CSI Student Chapter requested partnership with ${brandName} for ${eventObj.name}.`,
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

    setSelectedOppForModal(null);
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Saved Sponsors</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Your bookmarked brand sponsorship opportunities</p>
      </div>

      {/* Grid */}
      {savedSponsors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedSponsors.map((opp) => (
            <div
              key={opp.id}
              className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Header */}
              <div className="bg-[var(--brand-primary)] p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                      {opp.brandLogo || "NA"}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{opp.brandName}</h3>
                      <p className="text-[10px] text-white/80 font-medium">{opp.tagline || "OPEN FOR COLLEGE SPONSORSHIPS"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaved(opp.id)}
                    className="p-2 rounded-xl text-[var(--accent-pink)] bg-[var(--accent-pink-bg)] hover:bg-[var(--accent-pink-bg)]/80 transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Bookmark className="w-4.5 h-4.5 fill-[var(--accent-pink)]" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">What They Provide</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(opp.canProvide || []).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                          {typeof item === 'string' ? item : item.item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[var(--bg-surface-alt)] rounded-xl px-3 py-2 border border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Est. Value</span>
                    <span className="text-base font-bold text-[var(--text-primary)]">{opp.estimatedValue || "₹50,000"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex gap-2">
                  <button
                    onClick={() => setSelectedOppForViewDetails(opp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => setSelectedOppForModal(opp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Approach
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No saved sponsors yet. Bookmark brand opportunities from Discover Sponsors.</p>
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
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">About Program</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedOppForViewDetails.about || selectedOppForViewDetails.description || "Corporate sponsorship program for college events."}
              </p>
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
