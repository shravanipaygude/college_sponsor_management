import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Check, X, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { acceptRequest, declineRequest, updateRequestStatusThunk, fetchRequestsThunk } from "../../store/slices/requestSlice";
import { createPartnership, createPartnershipThunk } from "../../store/slices/partnershipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

import { useAuth } from "../../hooks/useAuth";

export default function CommitteeIncomingRequests() {
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
    const userOrg = (user.organizationName || user.committee || user.name || "").toLowerCase().trim();

    const receiverHex = r.receiver ? String(r.receiver._id || r.receiver) : null;
    if (receiverHex && userHexId && receiverHex === userHexId) {
      return true;
    }
    const receiverIdStr = r.receiverId ? String(r.receiverId) : null;
    if (receiverIdStr && userHexId && receiverIdStr === userHexId) {
      return true;
    }
    const commName = (r.committeeName || r.receiverName || "").toLowerCase().trim();
    if (commName && userOrg && commName === userOrg) {
      return true;
    }
    return false;
  });

  const [processingIds, setProcessingIds] = useState(new Set());

  const handleAccept = async (req) => {
    const reqId = req._id || req.id;
    if (processingIds.has(String(reqId))) return;

    setProcessingIds((prev) => new Set(prev).add(String(reqId)));

    try {
      await dispatch(updateRequestStatusThunk({ requestId: reqId, status: "accepted" })).unwrap();
      dispatch(acceptRequest(reqId));

      const commHex = user?._id || user?.id;
      const sponHex = req.sender ? (req.sender._id || req.sender).toString() : (req.senderId ? req.senderId.toString() : null);

      const partnershipPayload = {
        requestId: reqId,
        sponsorshipPostId: req.sponsorshipPostId || req.eventId || req.event?._id || req.event || null,
        eventId: req.sponsorshipPostId || req.eventId || req.event?._id || req.event || null,
        opportunityId: req.opportunityId || req.opportunity?._id || req.opportunity || null,
        committee: commHex,
        committeeId: commHex,
        committeeName: user?.organizationName || user?.committee || "College Committee",
        sponsor: sponHex,
        sponsorId: sponHex,
        sponsorName: req.brandName || req.senderName || "Corporate Sponsor",
        brandName: req.brandName || req.senderName || "Corporate Sponsor",
        brandLogo: req.brandLogo || "NA",
        collegeName: user?.collegeName || user?.college || req.collegeName || "VESIT",
        collegeLogo: "VE",
        eventName: req.eventName || req.event?.title || "College Event",
        brandOffers: Array.isArray(req.offering) ? req.offering : [req.offering || "Sponsorship"],
        brandProvides: Array.isArray(req.offering) ? req.offering : [req.offering || "Sponsorship"],
        committeeOffers: req.interestedIn || ["Main Stage Branding", "Product Demo"],
        committeeProvides: req.interestedIn || ["Main Stage Branding", "Product Demo"],
        estimatedValue: req.estimatedValue || "₹50,000",
        status: "Active",
        facultyApprovalStatus: "approved",
      };

      await dispatch(createPartnershipThunk(partnershipPayload)).unwrap();

      dispatch(
        addNotification({
          role: "Committee Head",
          title: "Partnership Accepted",
          message: `Accepted request from ${req.brandName} for ${req.eventName}.`,
        })
      );
    } catch (err) {
      console.error("Accept request error:", err);
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
        role: "Committee Head",
        title: "Partnership Declined",
        message: `Declined request from ${req.brandName}.`,
      })
    );
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Incoming Requests</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Partnership interest from brands wanting to sponsor your events</p>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Request Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm border border-[var(--border-strong)]">
                    {req.brandLogo || "NA"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-[var(--text-primary)]">{req.brandName}</span>
                      <span className="text-xs text-[var(--text-secondary)]">wants to partner with</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--brand-royal)]">{req.eventName}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              {/* Offering */}
              <div className="bg-[var(--bg-surface-alt)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-3">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1">Offering</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {Array.isArray(req.offering) ? req.offering.join(" + ") : req.offering}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Estimated Value: {req.estimatedValue}</p>
                </div>

                {req.interestedIn && req.interestedIn.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Interested In</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.interestedIn.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <Clock className="w-3 h-3" />
                Received {req.createdAt || req.receivedAt || "Recently"}
              </div>

              {/* Actions */}
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
                    onClick={() => handleAccept(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Interest
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

              {req.status === "Accepted" && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <p className="text-xs text-[var(--brand-royal)] font-medium">✓ Interest accepted — moves to partnership discussion</p>
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
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">From Sponsor</span>
                <span className="font-semibold">{selectedRequestForView.brandName || selectedRequestForView.senderName || "Corporate Sponsor"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Target Event</span>
                <span className="font-semibold">{selectedRequestForView.eventName || "Event"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Status</span>
                <StatusBadge status={selectedRequestForView.status} />
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Request Message</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedRequestForView.message || "No message attached."}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Offered by Sponsor</p>
              <p className="text-xs text-[var(--brand-primary)] font-bold">
                {selectedRequestForView.offering || selectedRequestForView.supportRequested || "Sponsorship & Vouchers"}
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
