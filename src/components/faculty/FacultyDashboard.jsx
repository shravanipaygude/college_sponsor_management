import React from "react";
import { Clock, AlertTriangle, Eye } from "lucide-react";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import { facultyStats, pendingApprovals } from "../../data/mockData";

export default function FacultyDashboard({ onNavigate }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatCard stats={facultyStats} />

      {/* Deals Requiring Attention */}
      <div className="bg-white rounded-2xl p-6 border border-taupe/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brown" />
            <h3 className="text-lg font-bold text-espresso">Deals Requiring Attention</h3>
          </div>
          <button
            onClick={() => onNavigate("pending_approvals")}
            className="text-xs font-bold text-brown hover:text-espresso transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {pendingApprovals.map((deal) => (
            <div key={deal.id} className="flex items-center justify-between p-4 rounded-xl border border-taupe/15 hover:bg-offWhite/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {deal.brandLogo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-espresso">{deal.brandName} × {deal.eventName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-brown mt-0.5">
                    <span>Value: {deal.estimatedTotalValue}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      Submitted {deal.submittedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="Awaiting Approval" />
                <button
                  onClick={() => onNavigate("pending_approvals")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors"
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
      <div className="bg-espresso rounded-2xl p-6 text-offWhite border border-taupe/20">
        <h3 className="text-sm font-bold mb-3">Approval Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facultyStats.map((stat) => (
            <div key={stat.id} className="bg-darkBrown/60 rounded-lg p-3 border border-taupe/15">
              <p className="text-[10px] text-taupe uppercase font-bold">{stat.title}</p>
              <p className="text-xl font-black text-offWhite">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
