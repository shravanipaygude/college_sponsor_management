import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, FileCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { pendingApprovals as initialApprovals } from "../../data/mockData";

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showRemarksFor, setShowRemarksFor] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [remarksAction, setRemarksAction] = useState(null);

  const handleApprove = (id) => {
    setApprovals(approvals.map((a) => a.id === id ? { ...a, status: "Approved" } : a));
    setSelectedDeal(null);
  };

  const openRemarks = (id, action) => {
    setShowRemarksFor(id);
    setRemarksAction(action);
    setRemarks("");
  };

  const submitRemarks = () => {
    if (showRemarksFor) {
      const newStatus = remarksAction === "reject" ? "Rejected" : "Changes Requested";
      setApprovals(approvals.map((a) =>
        a.id === showRemarksFor ? { ...a, status: newStatus, remarks } : a
      ));
      setShowRemarksFor(null);
      setRemarks("");
      setSelectedDeal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Pending Approvals</h2>
        <p className="text-xs text-brown mt-1">Review sponsorship deals submitted for faculty approval</p>
      </div>

      {/* Approval Cards */}
      <div className="space-y-6">
        {approvals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-espresso p-5 text-offWhite">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-darkBrown text-taupe flex items-center justify-center font-bold text-lg border border-taupe/30">
                    {deal.brandLogo}
                  </div>
                  <div>
                    <p className="text-[10px] text-taupe font-semibold uppercase tracking-wider">Sponsorship Approval</p>
                    <h3 className="text-lg font-bold">{deal.brandName}</h3>
                    <p className="text-xs text-taupe/80">{deal.eventName} • {deal.committeeName}</p>
                  </div>
                </div>
                <StatusBadge status={deal.status || "Awaiting Approval"} />
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Sponsor Provides */}
              <div>
                <p className="text-xs font-bold text-espresso uppercase tracking-wider mb-2">Sponsor Provides</p>
                {deal.sponsorProvides.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-offWhite/50 rounded-lg border border-taupe/20 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                    <span className="text-xs text-darkBrown font-medium flex-1">{item.item}</span>
                    <span className="text-[9px] text-brown bg-white px-1.5 py-0.5 rounded border border-taupe/20">{item.type}</span>
                  </div>
                ))}
              </div>

              {/* Estimated Value */}
              <div className="bg-offWhite/50 rounded-lg px-4 py-3 border border-taupe/20 text-center">
                <p className="text-[10px] font-bold text-brown uppercase">Estimated Total Value</p>
                <p className="text-2xl font-black text-espresso">{deal.estimatedTotalValue}</p>
              </div>

              {/* College Promises */}
              <div>
                <p className="text-xs font-bold text-espresso uppercase tracking-wider mb-2">College Promises</p>
                {deal.collegePromises.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-offWhite/50 rounded-lg border border-taupe/20 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                    <span className="text-xs text-darkBrown font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Submitted Info */}
              <div className="text-xs text-brown flex flex-wrap gap-3">
                <span>Submitted by: <span className="font-semibold text-darkBrown">{deal.submittedBy}</span></span>
                <span>Submitted: <span className="font-semibold text-darkBrown">{deal.submittedAt}</span></span>
              </div>

              {/* Actions */}
              {(!deal.status || deal.status === "Awaiting Approval") && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-taupe/20">
                  <button
                    onClick={() => handleApprove(deal.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Deal
                  </button>
                  <button
                    onClick={() => openRemarks(deal.id, "changes")}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-espresso bg-taupe/20 hover:bg-taupe/30 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Changes
                  </button>
                  <button
                    onClick={() => openRemarks(deal.id, "reject")}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-brown bg-offWhite hover:bg-darkBrown/10 border border-taupe/30 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Deal
                  </button>
                </div>
              )}

              {deal.status === "Approved" && (
                <div className="pt-3 border-t border-taupe/20">
                  <p className="text-xs font-medium text-brown flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-taupe" />
                    Deal approved
                  </p>
                </div>
              )}

              {(deal.status === "Rejected" || deal.status === "Changes Requested") && (
                <div className="pt-3 border-t border-taupe/20 space-y-2">
                  <p className="text-xs font-medium text-brown flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-brown" />
                    {deal.status}
                  </p>
                  {deal.remarks && (
                    <div className="bg-offWhite/50 rounded-lg p-3 border border-taupe/20">
                      <p className="text-[10px] font-bold text-brown uppercase mb-1">Remarks</p>
                      <p className="text-xs text-darkBrown">{deal.remarks}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remarks Modal */}
      <Modal
        isOpen={!!showRemarksFor}
        onClose={() => setShowRemarksFor(null)}
        title={remarksAction === "reject" ? "Reject Deal" : "Request Changes"}
        icon={remarksAction === "reject" ? XCircle : RotateCcw}
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Reason / Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remarks or reason..."
              rows={4}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRemarksFor(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitRemarks}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
            >
              {remarksAction === "reject" ? "Reject Deal" : "Submit Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
