import React from "react";

/**
 * Reusable status badge component.
 * Uses theme variables for consistent Light/Dark status representation.
 */
const statusStyles = {
  // Pending / New Request
  "Pending": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "New Request": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "New": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "Discussing": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "Awaiting Faculty Approval": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "Awaiting Approval": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",
  "Proof Submitted": "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]",

  // Interested / Revised
  "Interested": "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border-[var(--accent-pink)]/30",
  "Offer Revised": "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border-[var(--accent-pink)]/30",
  "In Progress": "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border-[var(--accent-pink)]/30",

  // Accepted / Approved / Active
  "Accepted": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",
  "Deal Agreed": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",
  "Approved": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",
  "Completed": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",
  "Active": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",
  "Open for Sponsors": "bg-[var(--brand-primary)]/25 text-[var(--text-primary)] border-[var(--brand-primary)]",

  // Declined / Rejected
  "Declined": "bg-red-500/15 text-red-500 border-red-500/30",
  "Rejected": "bg-red-500/15 text-red-500 border-red-500/30",
  "Changes Requested": "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

export default function StatusBadge({ status, className = "" }) {
  const style = statusStyles[status] || "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]";

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap ${style} ${className}`}
    >
      {status}
    </span>
  );
}
