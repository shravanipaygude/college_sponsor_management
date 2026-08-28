import React from "react";
import { Clock, AlertTriangle, Eye } from "lucide-react";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import { facultyStats, pendingApprovals } from "../../data/mockData";

export default function FacultyDashboard({ onNavigate }) {
  return (
    <div className="space-y-8 font-sans-ui">
      {/* Stats */}
      <StatCard stats={facultyStats} />

      {/* Deals Requiring Attention */}
      <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-pink)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Deals Requiring Attention</h3>
          </div>
          <button
            onClick={() => onNavigate("pending_approvals")}
            className="text-xs font-bold text-[var(--brand-royal)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {pendingApprovals.map((deal) => (
            <div key={deal.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm border border-[var(--border-strong)]">
                  {deal.brandLogo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{deal.brandName} × {deal.eventName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                    <span>Value: {deal.estimatedTotalValue}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[var(--brand-royal)]" />
                      Submitted {deal.submittedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="Awaiting Approval" />
                <button
                  onClick={() => onNavigate("pending_approvals")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[var(--brand-primary)] hover:opacity-90 transition-colors cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[var(--brand-primary)] rounded-3xl p-6 text-white border border-[var(--border-strong)] shadow-xl">
        <h3 className="text-sm font-bold mb-3 text-white">Approval Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facultyStats.map((stat) => (
            <div key={stat.id} className="bg-black/20 rounded-2xl p-3 border border-white/20">
              <p className="text-[10px] text-white/80 font-mono uppercase font-bold">{stat.title}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
