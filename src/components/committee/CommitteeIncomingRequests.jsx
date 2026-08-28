import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Check, X, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { acceptRequest, declineRequest } from "../../store/slices/requestSlice";
import { createPartnership } from "../../store/slices/partnershipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function CommitteeIncomingRequests() {
  const dispatch = useDispatch();
  const allRequests = useSelector((state) => state.requests.items);

  // Filter requests intended for Committee
  const requests = allRequests.filter((r) => {
    const isCommitteeTarget =
      r.receiverRole === "committee" ||
      r.receiverRole === "Committee Head" ||
      r.senderRole === "sponsor" ||
      r.senderRole === "Corporate Sponsor" ||
      r.senderRole === "brand";

    return isCommitteeTarget;
  });

  const handleAccept = (req) => {
    dispatch(acceptRequest(req.id));

    // Automatically create a partnership in Redux
    dispatch(
      createPartnership({
        requestId: req.id,
        committeeId: req.receiverId || 1,
        committeeName: "CSI Student Chapter",
        sponsorId: req.senderId || 1,
        sponsorName: req.brandName,
        brandName: req.brandName,
        brandLogo: req.brandLogo || "NA",
        collegeName: "VESIT",
        collegeLogo: "VE",
        eventName: req.eventName,
        brandOffers: Array.isArray(req.offering) ? req.offering : [req.offering],
        brandProvides: Array.isArray(req.offering) ? req.offering : [req.offering],
        committeeOffers: req.interestedIn || ["Main Stage Branding", "Product Demo"],
        committeeProvides: req.interestedIn || ["Main Stage Branding", "Product Demo"],
        estimatedValue: req.estimatedValue || "₹50,000",
        status: "Negotiation",
      })
    );

    // Notifications
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Partnership Accepted",
        message: `Accepted request from ${req.brandName} for ${req.eventName}.`,
      })
    );

    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Request Accepted!",
        message: `Your partnership request for ${req.eventName} was accepted.`,
      })
    );
  };

  const handleDecline = (req) => {
    dispatch(declineRequest(req.id));
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Partnership Declined",
        message: `Declined request from ${req.brandName}.`,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Incoming Requests</h2>
        <p className="text-xs text-brown mt-1">Partnership interest from brands wanting to sponsor your events</p>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Request Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                    {req.brandLogo || "NA"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-espresso">{req.brandName}</span>
                      <span className="text-xs text-brown">wants to partner with</span>
                    </div>
                    <p className="text-sm font-semibold text-darkBrown">{req.eventName}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              {/* Offering */}
              <div className="bg-offWhite/50 rounded-xl p-4 border border-taupe/20 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1">Offering</p>
                  <p className="text-sm font-semibold text-espresso">
                    {Array.isArray(req.offering) ? req.offering.join(" + ") : req.offering}
                  </p>
                  <p className="text-xs text-brown mt-0.5">Estimated Value: {req.estimatedValue}</p>
                </div>

                {req.interestedIn && req.interestedIn.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Interested In</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.interestedIn.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-[10px] text-brown">
                <Clock className="w-3 h-3" />
                Received {req.createdAt || req.receivedAt || "Recently"}
              </div>

              {/* Actions */}
              {(req.status === "New" || req.status === "Pending") && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-taupe/20">
                  <button
                    onClick={() => alert(`Viewing full request from ${req.brandName}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Request
                  </button>
                  <button
                    onClick={() => handleAccept(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Interest
                  </button>
                  <button
                    onClick={() => handleDecline(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brown bg-offWhite hover:bg-darkBrown/10 border border-taupe/30 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              )}

              {req.status === "Accepted" && (
                <div className="pt-2 border-t border-taupe/20">
                  <p className="text-xs text-brown font-medium">✓ Interest accepted — moves to partnership discussion</p>
                </div>
              )}

              {req.status === "Declined" && (
                <div className="pt-2 border-t border-taupe/20">
                  <p className="text-xs text-brown font-medium">✗ Request declined</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center">
          <p className="text-sm text-brown">No incoming requests at this time.</p>
        </div>
      )}
    </div>
  );
}
