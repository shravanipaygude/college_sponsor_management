import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { updateFacultyApprovalThunk, updatePartnershipStatus } from "../../store/slices/partnershipSlice";
import { useAuth } from "../../hooks/useAuth";

export default function PendingApprovals() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allPartnerships = useSelector((state) => state.partnerships.items);

  const rawApprovals = allPartnerships.filter((p) => {
    const facStatus = p.facultyApprovalStatus;
    const uiStatus = p.status;
    const isPending = facStatus === "pending" || uiStatus === "Awaiting Approval" || uiStatus === "Negotiation" || !facStatus;

    if (!isPending) return false;
    if (!user) return true;

    const userCollege = (user?.collegeName || user?.college || "").toLowerCase();
    const dealCollege = (p.collegeName || p.college || "").toLowerCase();

    if (userCollege && dealCollege) {
      return userCollege === dealCollege;
    }
    return true;
  });

  const approvals = Array.from(
    new Map(rawApprovals.map((p) => [String(p._id || p.id), p])).values()
  );

  const [showRemarksFor, setShowRemarksFor] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [remarksAction, setRemarksAction] = useState(null);

  const handleApprove = (deal) => {
    const id = deal.id;
    dispatch(
      updateFacultyApprovalThunk({
        partnershipId: id,
        facultyApprovalStatus: "approved",
        approvedBy: user?.name || "Faculty Approver",
      })
    );
    dispatch(
      updatePartnershipStatus({
        id,
        status: "Approved",
        approvedBy: user?.name || "Faculty Approver",
      })
    );
  };

  const openRemarks = (id, action) => {
    setShowRemarksFor(id);
    setRemarksAction(action);
    setRemarks("");
  };

  const submitRemarks = () => {
    if (showRemarksFor) {
      const backendFacStatus = remarksAction === "reject" ? "rejected" : "rejected";
      const uiStatus = remarksAction === "reject" ? "Rejected" : "Changes Requested";

      dispatch(
        updateFacultyApprovalThunk({
          partnershipId: showRemarksFor,
          facultyApprovalStatus: backendFacStatus,
          facultyRemarks: remarks,
          approvedBy: user?.name || "Faculty Approver",
        })
      );
      dispatch(
        updatePartnershipStatus({
          id: showRemarksFor,
          status: uiStatus,
          facultyRemarks: remarks,
          approvedBy: user?.name || "Faculty Approver",
        })
      );

      setShowRemarksFor(null);
      setRemarks("");
    }
  };

  return (
    <div className="space-y-6 font-sans-ui">
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Pending Approvals</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Review sponsorship deals submitted for faculty approval</p>
      </div>

      {/* Approval Cards */}
      <div className="space-y-6">
        {approvals.map((deal) => (
          <div key={deal.id} className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm overflow-hidden font-sans-ui">
            {/* Header */}
            <div className="bg-[var(--brand-primary)] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-lg border border-white/30">
                    {deal.brandLogo || "NA"}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/80 font-bold uppercase tracking-wider">Sponsorship Approval</p>
                    <h3 className="text-lg font-bold text-white">{deal.brandName}</h3>
                    <p className="text-xs text-white/90">{deal.eventName} • {deal.committeeName}</p>
                  </div>
                </div>
                <StatusBadge status={deal.status || "Awaiting Approval"} />
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Sponsor Provides */}
              <div>
                <p className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">Sponsor Provides</p>
                {(Array.isArray(deal.sponsorProvides) ? deal.sponsorProvides : Array.isArray(deal.brandOffers) ? deal.brandOffers.map(b => ({ item: b, type: "Monetary" })) : []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-subtle)] mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                    <span className="text-xs text-[var(--text-primary)] font-medium flex-1">{typeof item === 'string' ? item : item.item}</span>
                    <span className="text-[9px] font-bold text-[var(--brand-primary)] bg-[var(--bg-card)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">{typeof item === 'string' ? "Support" : item.type}</span>
                  </div>
                ))}
              </div>

              {/* Estimated Value */}
              <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-4 py-3 border border-[var(--border-subtle)] text-center">
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Total Value</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{deal.estimatedTotalValue || deal.estimatedValue || "₹50,000"}</p>
              </div>

              {/* College Promises */}
              <div>
                <p className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">College Promises</p>
                {(Array.isArray(deal.collegePromises) ? deal.collegePromises : Array.isArray(deal.committeeOffers) ? deal.committeeOffers : []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-subtle)] mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                    <span className="text-xs text-[var(--text-primary)] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Submitted Info */}
              <div className="text-xs text-[var(--text-secondary)] flex flex-wrap gap-3">
                <span>Submitted by: <span className="font-semibold text-[var(--text-primary)]">{deal.submittedBy || deal.committeeName}</span></span>
                <span>Submitted: <span className="font-semibold text-[var(--text-primary)]">{deal.submittedAt || deal.createdAt || "Recently"}</span></span>
              </div>

              {/* Actions */}
              {(!deal.facultyApprovalStatus || deal.facultyApprovalStatus === "pending" || deal.status === "Awaiting Approval" || deal.status === "Negotiation") && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleApprove(deal)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Deal
                  </button>
                  <button
                    onClick={() => openRemarks(deal.id, "changes")}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Changes
                  </button>
                  <button
                    onClick={() => openRemarks(deal.id, "reject")}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Deal
                  </button>
                </div>
              )}

              {deal.facultyApprovalStatus === "approved" || deal.status === "Approved" ? (
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <p className="text-xs font-medium text-[var(--brand-royal)] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                    Deal approved
                  </p>
                </div>
              ) : null}

              {(deal.facultyApprovalStatus === "rejected" || deal.status === "Rejected" || deal.status === "Changes Requested") && (
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  <p className="text-xs font-medium text-red-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    {deal.status || "Rejected"}
                  </p>
                  {(deal.facultyRemarks || deal.remarks) && (
                    <div className="bg-[var(--bg-surface-alt)] rounded-xl p-3 border border-[var(--border-subtle)]">
                      <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Remarks</p>
                      <p className="text-xs text-[var(--text-primary)]">{deal.facultyRemarks || deal.remarks}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {approvals.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No pending approvals at this time.</p>
        </div>
      )}

      {/* Remarks Modal */}
      <Modal
        isOpen={!!showRemarksFor}
        onClose={() => setShowRemarksFor(null)}
        title={remarksAction === "reject" ? "Reject Deal" : "Request Changes"}
        icon={remarksAction === "reject" ? XCircle : RotateCcw}
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4 font-sans-ui">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Reason / Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remarks or reason..."
              rows={4}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRemarksFor(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={submitRemarks}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer shadow-sm"
            >
              {remarksAction === "reject" ? "Reject Deal" : "Submit Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
