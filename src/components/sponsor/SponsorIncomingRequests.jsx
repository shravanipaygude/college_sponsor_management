import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Check, X, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { acceptRequest, declineRequest } from "../../store/slices/requestSlice";
import { createPartnership } from "../../store/slices/partnershipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function SponsorIncomingRequests() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allRequests = useSelector((state) => state.requests.items);

  const requests = allRequests.filter((r) => {
    const isSponsorTarget =
      r.receiverRole === "sponsor" ||
      r.receiverRole === "Corporate Sponsor" ||
      r.receiverRole === "brand" ||
      r.senderRole === "committee" ||
      r.senderRole === "Committee Head";

    if (!isSponsorTarget) return false;

    const currentSponsorId = user?.id || "demo_sponsor_1";
    const currentCompany = (user?.company || user?.name || "NovaAI").toLowerCase();

    const isMatch =
      r.receiverId === currentSponsorId ||
      r.receiverId === "demo_sponsor_1" ||
      r.receiverId === "sponsor-1" ||
      (r.receiverName && r.receiverName.toLowerCase().includes("novaai")) ||
      (r.brandName && r.brandName.toLowerCase().includes("novaai")) ||
      (currentCompany && r.brandName && r.brandName.toLowerCase().includes(currentCompany)) ||
      (currentCompany && r.receiverName && r.receiverName.toLowerCase().includes(currentCompany));

    return isMatch;
  });

  const handleInterested = (req) => {
    dispatch(acceptRequest(req.id));

    dispatch(
      createPartnership({
        requestId: req.id,
        committeeId: req.senderId || "demo_committee_1",
        committeeName: req.senderName || `${req.collegeName || "VESIT"} Committee`,
        sponsorId: req.receiverId || user?.id || "demo_sponsor_1",
        sponsorName: user?.company || req.receiverName || req.brandName || "NovaAI Technologies",
        brandName: user?.company || req.receiverName || req.brandName || "NovaAI Technologies",
        brandLogo: req.brandLogo || "NA",
        collegeName: req.collegeName || "VESIT",
        collegeLogo: req.collegeLogo || "VE",
        eventName: req.eventName || "College Event",
        brandOffers: Array.isArray(req.requesting) ? req.requesting : [req.requesting || "Sponsorship Support"],
        brandProvides: Array.isArray(req.requesting) ? req.requesting : [req.requesting || "Sponsorship Support"],
        committeeOffers: Array.isArray(req.theyOffer) ? req.theyOffer : [req.theyOffer || "Main Stage Branding"],
        committeeProvides: Array.isArray(req.theyOffer) ? req.theyOffer : [req.theyOffer || "Main Stage Branding"],
        estimatedValue: req.estimatedValue || "₹50,000",
        status: "Negotiation",
      })
    );

    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Interest Confirmed",
        message: `Confirmed interest in request from ${req.eventName}.`,
      })
    );

    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Sponsor Interested!",
        message: `${req.receiverName || "Sponsor"} confirmed interest in ${req.eventName}.`,
      })
    );
  };

  const handleDecline = (req) => {
    dispatch(declineRequest(req.id));
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
                    onClick={() => alert(`Viewing full request from ${req.collegeName || "Committee"}`)}
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
    </div>
  );
}
