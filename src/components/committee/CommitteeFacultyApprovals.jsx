import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Clock, CheckCircle, Eye, ShieldCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

export default function CommitteeFacultyApprovals() {
  const allPartnerships = useSelector((state) => state.partnerships.items);
  const [selectedApprovalForView, setSelectedApprovalForView] = useState(null);

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Faculty Approvals</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Track approval status of deals submitted to faculty</p>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {allPartnerships.map((approval) => (
          <div
            key={approval.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {approval.brandName} × {approval.eventName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Estimated Value: {approval.estimatedValue || approval.estimatedTotalValue || "₹50,000"}</p>
              </div>
              <StatusBadge status={approval.status || "Awaiting Approval"} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--brand-royal)]" />
                Submitted: {approval.submittedAt || approval.createdAt || "Recently"}
              </span>
              {approval.facultyApprovalStatus === "approved" && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  Approved: {approval.approvedAt || approval.lastUpdated || "Recently"}
                </span>
              )}
            </div>

            {(approval.facultyRemarks || approval.remarks) && (
              <div className="mt-3 bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                <span className="font-bold text-[var(--brand-royal)]">Faculty Remarks: </span>
                {approval.facultyRemarks || approval.remarks}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setSelectedApprovalForView(approval)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                View Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {allPartnerships.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No faculty approval deals tracked yet.</p>
        </div>
      )}

      {/* View Deal Modal */}
      <Modal
        isOpen={!!selectedApprovalForView}
        onClose={() => setSelectedApprovalForView(null)}
        title="Faculty Approval Details"
        icon={ShieldCheck}
        maxWidth="max-w-lg"
      >
        {selectedApprovalForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Brand Name</span>
                <span className="font-semibold">{selectedApprovalForView.brandName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event Name</span>
                <span className="font-semibold">{selectedApprovalForView.eventName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Approval Status</span>
                <StatusBadge status={selectedApprovalForView.facultyApprovalStatus || selectedApprovalForView.status} />
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Faculty Remarks</p>
              <p className="text-xs text-[var(--text-primary)] bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
                {selectedApprovalForView.facultyRemarks || selectedApprovalForView.remarks || "No remarks provided by faculty approver."}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Support / Deliverables</p>
              <p className="text-xs text-[var(--brand-primary)] font-bold">
                {Array.isArray(selectedApprovalForView.brandOffers) ? selectedApprovalForView.brandOffers.join(" + ") : selectedApprovalForView.brandOffers || "₹50,000 Support"}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApprovalForView(null)}
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
