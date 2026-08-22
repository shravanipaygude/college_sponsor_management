import React from "react";

/**
 * Reusable status badge component.
 * Consistent styling across all roles for deal/deliverable/approval statuses.
 */
const statusStyles = {
  // Deal statuses
  "New Request": "bg-taupe/20 text-darkBrown border-taupe/40",
  "New": "bg-taupe/20 text-darkBrown border-taupe/40",
  "Discussing": "bg-brown/10 text-brown border-brown/30",
  "Offer Revised": "bg-taupe/30 text-espresso border-taupe/50",
  "Deal Agreed": "bg-espresso/10 text-espresso border-espresso/30",
  "Awaiting Faculty Approval": "bg-taupe/20 text-darkBrown border-taupe/40",
  "Awaiting Approval": "bg-taupe/20 text-darkBrown border-taupe/40",
  "Approved": "bg-taupe/30 text-espresso border-taupe/50",
  "Rejected": "bg-darkBrown/15 text-darkBrown border-darkBrown/30",
  "Changes Requested": "bg-brown/15 text-brown border-brown/40",
  // Deliverable statuses
  "Pending": "bg-darkBrown/10 text-brown border-taupe/20",
  "In Progress": "bg-offWhite text-brown border-taupe/40",
  "Proof Submitted": "bg-taupe/20 text-darkBrown border-taupe/40",
  "Completed": "bg-taupe/30 text-espresso border-taupe/50",
  // Post/Opportunity statuses
  "Active": "bg-taupe/30 text-espresso border-taupe/50",
  "Planning": "bg-offWhite text-brown border-taupe/40",
  "Not Yet Open": "bg-darkBrown/10 text-brown border-taupe/20",
  "Open for Sponsors": "bg-taupe/30 text-espresso border-taupe/50",
};

export default function StatusBadge({ status, className = "" }) {
  const style = statusStyles[status] || "bg-taupe/20 text-darkBrown border-taupe/30";

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${style} ${className}`}
    >
      {status}
    </span>
  );
}
