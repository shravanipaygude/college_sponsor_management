import React from "react";
import {
  Users, IndianRupee, Gift, CheckSquare, Clock, Handshake,
  Megaphone, Inbox, Eye, CheckCircle, XCircle,
} from "lucide-react";

const iconMap = {
  Users,
  IndianRupee,
  Gift,
  CheckSquare,
  Clock,
  Handshake,
  Megaphone,
  Inbox,
  Eye,
  CheckCircle,
  XCircle,
};

/**
 * Reusable StatCard component for metric dashboards.
 * Uses theme variables for global Light/Dark mode consistency.
 */
export default function StatCard({ stats }) {
  const colClass = stats.length <= 4
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : stats.length === 5
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";

  return (
    <div className={`grid ${colClass} gap-4 sm:gap-5 font-sans-ui`}>
      {stats.map((stat) => {
        const IconComponent = iconMap[stat.iconName] || Users;
        return (
          <div
            key={stat.id}
            className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors duration-200 shrink-0">
                <IconComponent className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[11px] font-medium text-[var(--text-secondary)] flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)] shrink-0" />
                <span>{stat.subtext}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
