import React from "react";
import { useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

export default function ApprovedDeals() {
  const { user } = useAuth();
  const allPartnerships = useSelector((state) => state.partnerships.items);
  const rawApproved = allPartnerships.filter((p) => {
    const isApproved = p.facultyApprovalStatus === "approved" || p.status === "Approved";
    if (!isApproved) return false;
    if (!user) return true;

    const userCollege = (user?.collegeName || user?.college || "").toLowerCase();
    const dealCollege = (p.collegeName || p.college || "").toLowerCase();

    if (userCollege && dealCollege) {
      return userCollege === dealCollege;
    }
    return true;
  });

  const approvedDeals = Array.from(
    new Map(rawApproved.map((p) => [String(p._id || p.id), p])).values()
  );

  return (
    <div className="space-y-6 font-sans-ui">
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Approved Deals</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Sponsorship deals that have been approved by faculty</p>
      </div>

      <div className="space-y-4">
        {approvedDeals.map((deal) => (
          <div key={deal.id} className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm border border-[var(--border-strong)]">
                  {deal.brandLogo || "NA"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{deal.brandName}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{deal.eventName} • {deal.committeeName}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--border-subtle)]">
                Approved
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Sponsor Provides</p>
                <ul className="space-y-1">
                  {(Array.isArray(deal.sponsorProvides) ? deal.sponsorProvides : Array.isArray(deal.brandOffers) ? deal.brandOffers.map(b => ({ item: b })) : []).map((item, i) => (
                    <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                      {typeof item === 'string' ? item : item.item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">College Promises</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(deal.collegePromises) ? deal.collegePromises : Array.isArray(deal.committeeOffers) ? deal.committeeOffers : []).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span>Value: <span className="font-bold text-[var(--text-primary)]">{deal.estimatedTotalValue || deal.estimatedValue || "₹50,000"}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                Approved {deal.approvedAt || deal.lastUpdated || "Recently"} by {deal.approvedBy || "Faculty Approver"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {approvedDeals.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No approved deals yet.</p>
        </div>
      )}
    </div>
  );
}
