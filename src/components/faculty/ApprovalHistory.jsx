import React from "react";
import { useSelector } from "react-redux";
import { CheckCircle, XCircle, Clock, History } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

export default function ApprovalHistory() {
  const { user } = useAuth();
  const rawPartnerships = useSelector((state) => state.partnerships.items);

  const rawFiltered = rawPartnerships.filter((p) => {
    if (!user) return true;
    const userCollege = (user?.collegeName || user?.college || "").toLowerCase();
    const dealCollege = (p.collegeName || p.college || "").toLowerCase();
    if (userCollege && dealCollege) {
      return userCollege === dealCollege;
    }
    return true;
  });

  const allPartnerships = Array.from(
    new Map(rawFiltered.map((p) => [String(p._id || p.id), p])).values()
  );

  const getActionStyle = (action) => {
    switch (action) {
      case "Approved":
      case "approved":
        return { icon: CheckCircle, bgClass: "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]", dotClass: "bg-[var(--brand-primary)]" };
      case "Rejected":
      case "rejected":
        return { icon: XCircle, bgClass: "bg-red-500/10 text-red-500", dotClass: "bg-red-500" };
      default:
        return { icon: Clock, bgClass: "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)]", dotClass: "bg-[var(--brand-royal)]" };
    }
  };

  return (
    <div className="space-y-6 font-sans-ui">
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[var(--brand-royal)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Approval History</h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Chronological record of all approval actions</p>
      </div>

      {/* Timeline */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-6">
        <div className="space-y-0">
          {allPartnerships.map((entry, idx) => {
            const action = entry.status || (entry.facultyApprovalStatus === "approved" ? "Approved" : entry.facultyApprovalStatus === "rejected" ? "Rejected" : "Pending");
            const { icon: Icon, bgClass } = getActionStyle(action);
            const isLast = idx === allPartnerships.length - 1;

            return (
              <div key={entry.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-[var(--border-subtle)] my-1" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {entry.brandName} × {entry.eventName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          action === "Approved" || action === "approved"
                            ? "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border-[var(--border-subtle)]"
                            : action === "Rejected" || action === "rejected"
                            ? "bg-red-500/10 text-red-500 border-red-500/30"
                            : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
                        }`}>
                          {action}
                        </span>
                        {(entry.facultyRemarks || entry.remarks) && (
                          <span className="text-[10px] text-[var(--text-secondary)] italic">"{entry.facultyRemarks || entry.remarks}"</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium shrink-0">{entry.submittedAt || entry.createdAt || "Recently"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
