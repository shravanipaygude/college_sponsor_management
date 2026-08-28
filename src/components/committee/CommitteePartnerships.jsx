import React from "react";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function CommitteePartnerships() {
  const partnerships = useSelector((state) => state.partnerships.items);

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Partnerships</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Active partnership discussions and negotiations with sponsors</p>
      </div>

      {/* Partnership Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnerships.map((p) => (
          <div
            key={p.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Partnership Header */}
            <div className="bg-[var(--brand-primary)] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                  {p.brandLogo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.brandName} × {p.eventName}</h3>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            {/* Partnership Body */}
            <div className="p-5 space-y-4 flex-1">
              {/* Brand Offers */}
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">{p.brandName} Offers</p>
                <ul className="space-y-1">
                  {p.brandOffers.map((item, i) => (
                    <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Committee Offers */}
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Committee Offers</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.committeeOffers.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estimated Value */}
              <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-3.5 py-2.5 border border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)] font-medium">Estimated Value</span>
                <span className="text-base font-black text-[var(--text-primary)]">{p.estimatedValue}</span>
              </div>

              <p className="text-[10px] text-[var(--text-secondary)]">Last updated: {p.lastUpdated}</p>

              {/* Action */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => alert(`Viewing partnership: ${p.brandName} × ${p.eventName}`)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Partnership
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
