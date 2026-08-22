import React from "react";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { committeeFacultyApprovals } from "../../data/mockData";

export default function CommitteeFacultyApprovals() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Faculty Approvals</h2>
        <p className="text-xs text-brown mt-1">Track approval status of deals submitted to faculty</p>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {committeeFacultyApprovals.map((approval) => (
          <div
            key={approval.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-espresso">
                  {approval.brandName} × {approval.eventName}
                </h3>
                <p className="text-xs text-brown mt-0.5">Estimated Value: {approval.estimatedValue}</p>
              </div>
              <StatusBadge status={approval.status} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-brown">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-taupe" />
                Submitted: {approval.submittedAt}
              </span>
              {approval.approvedAt && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-taupe" />
                  Approved: {approval.approvedAt}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-taupe/15">
              <button
                onClick={() => alert(`Viewing deal: ${approval.brandName} × ${approval.eventName}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
