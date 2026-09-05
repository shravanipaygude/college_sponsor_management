import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Check, X, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { useAuth } from "../../hooks/useAuth";
import { acceptRequest, declineRequest, updateRequestStatusThunk, fetchRequestsThunk } from "../../store/slices/requestSlice";
import { createPartnership, createPartnershipThunk } from "../../store/slices/partnershipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function SponsorIncomingRequests() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allRequests = useSelector((state) => state.requests.items);
  const [selectedRequestForView, setSelectedRequestForView] = useState(null);

  useEffect(() => {
    dispatch(fetchRequestsThunk());
  }, [dispatch]);

  const requests = allRequests.filter((r) => {
    if (!user) return false;

    const userHexId = String(user._id || user.id || "");
    const userOrg = (user.organizationName || user.company || user.name || "").toLowerCase().trim();

    const receiverHex = r.receiver ? String(r.receiver._id || r.receiver) : null;
    if (receiverHex && userHexId && receiverHex === userHexId) {
      return true;
    }
    const receiverIdStr = r.receiverId ? String(r.receiverId) : null;
    if (receiverIdStr && userHexId && receiverIdStr === userHexId) {
      return true;
    }
    const brandStr = (r.brandName || r.receiverName || "").toLowerCase().trim();
    if (brandStr && userOrg && brandStr === userOrg) {
      return true;
    }
    return false;
  });

  const [processingIds, setProcessingIds] = useState(new Set());

  const handleInterested = async (req) => {
    const reqId = req._id || req.id;
    if (processingIds.has(String(reqId))) return;

    setProcessingIds((prev) => new Set(prev).add(String(reqId)));

    try {
      await dispatch(updateRequestStatusThunk({ requestId: reqId, status: "accepted" })).unwrap();
      dispatch(acceptRequest(reqId));

      const commHex = req.sender ? (req.sender._id || req.sender).toString() : (req.senderId ? req.senderId.toString() : null);
      const sponHex = user?._id || user?.id;

      const partnershipPayload = {
        requestId: reqId,
        opportunityId: req.opportunityId || req.opportunity?._id || req.opportunity || null,
        sponsorshipPostId: req.sponsorshipPostId || req.eventId || req.event?._id || req.event || null,
        eventId: req.sponsorshipPostId || req.eventId || req.event?._id || req.event || null,
        committee: commHex,
        committeeId: commHex,
        committeeName: req.senderName || `${req.collegeName || "VESIT"} Committee`,
        sponsor: sponHex,
        sponsorId: sponHex,
        sponsorName: user?.organizationName || user?.company || user?.name || "Corporate Sponsor",
        brandName: user?.organizationName || user?.company || user?.name || "Corporate Sponsor",
        brandLogo: req.brandLogo || "NA",
        collegeName: req.collegeName || "VESIT",
        collegeLogo: req.collegeLogo || "VE",
        eventName: req.eventName || req.opportunityTitle || "College Partnership",
        brandOffers: Array.isArray(req.requesting) ? req.requesting : [req.requesting || "Sponsorship Support"],
        brandProvides: Array.isArray(req.requesting) ? req.requesting : [req.requesting || "Sponsorship Support"],
        committeeOffers: Array.isArray(req.theyOffer) ? req.theyOffer : [req.theyOffer || "Main Stage Branding"],
        committeeProvides: Array.isArray(req.theyOffer) ? req.theyOffer : [req.theyOffer || "Main Stage Branding"],
        estimatedValue: req.estimatedValue || "₹50,000",
        status: "Active",
        facultyApprovalStatus: "approved",
      };

      await dispatch(createPartnershipThunk(partnershipPayload)).unwrap();

      dispatch(
        addNotification({
          role: "Corporate Sponsor",
          title: "Interest Confirmed",
          message: `Confirmed interest in request from ${req.eventName}.`,
        })
      );
    } catch (err) {
      console.error("Confirm interest error:", err);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(String(reqId));
        return next;
      });
    }
  };

  const handleDecline = (req) => {
    const reqId = req._id || req.id;
    dispatch(updateRequestStatusThunk({ requestId: reqId, status: "declined" }));
    dispatch(declineRequest(reqId));
    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Request Declined",
        message: `Declined request from ${req.eventName}.`,
      })
    );
  };

  return (
    <div className="space-y-6 font-sans-ui">
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Incoming Requests</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">College committees interested in your sponsorship programs</p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm border border-[var(--border-strong)]">
                    {req.collegeLogo || "VE"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">{req.eventName}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      <span className="font-medium">{req.collegeName || "VESIT"}</span>
                      <span> requested partnership:</span>
                    </p>
                    <p className="text-xs font-semibold text-[var(--brand-royal)] mt-0.5">
                      {req.opportunityTitle || req.brandName || "Sponsorship Program"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="bg-[var(--bg-surface-alt)] rounded-2xl p-4 border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">They Are Requesting</p>
                  <ul className="space-y-1">
                    {(Array.isArray(req.requesting) ? req.requesting : [req.requesting || "Sponsorship Support"]).map((item, i) => (
                      <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">They Can Offer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(req.theyOffer) ? req.theyOffer : req.interestedIn || ["Stage Branding"]).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <Clock className="w-3 h-3" />
                Received {req.createdAt || req.receivedAt || "Recently"}
              </div>

              {(req.status === "New" || req.status === "Pending") && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => setSelectedRequestForView(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Request
                  </button>
                  <button
                    onClick={() => handleInterested(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Interested
                  </button>
                  <button
                    onClick={() => handleDecline(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              )}

              {(req.status === "Interested" || req.status === "Accepted") && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <p className="text-xs text-[var(--brand-royal)] font-medium">✓ Interest confirmed — partnership discussion initiated</p>
                </div>
              )}

              {req.status === "Declined" && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <p className="text-xs text-red-400 font-medium">✗ Request declined</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No incoming requests at this time.</p>
        </div>
      )}

      {/* View Request Modal */}
      <Modal
        isOpen={!!selectedRequestForView}
        onClose={() => setSelectedRequestForView(null)}
        title="Sponsorship Request Details"
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedRequestForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">From Committee</span>
                <span className="font-semibold">{selectedRequestForView.senderName || selectedRequestForView.collegeName || "Committee Head"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Opportunity / Event</span>
                <span className="font-semibold">{selectedRequestForView.eventName || selectedRequestForView.opportunityTitle || "Sponsorship Program"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Status</span>
                <StatusBadge status={selectedRequestForView.status} />
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Approach Message</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedRequestForView.message || "No message attached."}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Requested Support</p>
              <p className="text-xs text-[var(--brand-primary)] font-bold">
                {selectedRequestForView.offering || selectedRequestForView.supportRequested || "Monetary & Credits"}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRequestForView(null)}
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
