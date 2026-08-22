import React, { useState } from "react";
import { Eye, Check, X, Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { brandIncomingRequests as initialRequests } from "../../data/mockData";

export default function SponsorIncomingRequests() {
  const [requests, setRequests] = useState(initialRequests);

  const handleInterested = (id) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "Interested" } : r));
  };

  const handleDecline = (id) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "Declined" } : r));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Incoming Requests</h2>
        <p className="text-xs text-brown mt-1">College committees interested in your sponsorship programs</p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                    {req.collegeLogo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-espresso">{req.eventName}</h3>
                    <p className="text-xs text-brown">
                      <span className="font-medium">{req.collegeName}</span>
                      <span className="text-brown/60"> is interested in your:</span>
                    </p>
                    <p className="text-xs font-semibold text-darkBrown mt-0.5">{req.opportunityTitle}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="bg-offWhite/50 rounded-xl p-4 border border-taupe/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">They Are Requesting</p>
                  <ul className="space-y-1">
                    {req.requesting.map((item, i) => (
                      <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">They Can Offer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {req.theyOffer.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-brown">
                <Clock className="w-3 h-3" />
                Received {req.receivedAt}
              </div>

              {req.status === "New" && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-taupe/20">
                  <button
                    onClick={() => alert(`Viewing full request from ${req.collegeName}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Request
                  </button>
                  <button
                    onClick={() => handleInterested(req.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Interested
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brown bg-offWhite hover:bg-darkBrown/10 border border-taupe/30 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              )}

              {req.status === "Interested" && (
                <div className="pt-2 border-t border-taupe/20">
                  <p className="text-xs text-brown font-medium">✓ Interest confirmed — partnership discussion initiated</p>
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
    </div>
  );
}
