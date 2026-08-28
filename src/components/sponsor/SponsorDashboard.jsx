import React from "react";
import { TrendingUp, Calendar, Users, Eye } from "lucide-react";
import StatCard from "../common/StatCard";
import { brandStats, recommendedEvents, brandPartnerships } from "../../data/mockData";

export default function SponsorDashboard({ onNavigate }) {
  return (
    <div className="space-y-8 font-sans-ui">
      {/* Stats */}
      <StatCard stats={brandStats} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Events */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recommended College Events</h3>
            <button
              onClick={() => onNavigate("discover_events")}
              className="text-xs font-bold text-[var(--brand-royal)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recommendedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-xs border border-[var(--border-strong)]">
                    {event.college.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{event.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                      <span>{event.college}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-[var(--brand-royal)]" />
                        {event.participants}
                      </span>
                      <span>•</span>
                      <span>{event.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border border-[var(--accent-pink)]/30">
                    {event.match} match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Partnership Activity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Active Deals</h3>
            <div className="space-y-3">
              {brandPartnerships.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{p.eventName}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{p.collegeName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--border-subtle)]">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono">Value: {p.estimatedValue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--brand-primary)] rounded-3xl p-6 text-white border border-[var(--border-strong)] shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Sponsorship Impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-2xl p-3 border border-white/20">
                <p className="text-[10px] text-white/80 uppercase font-mono font-bold">Total Invested</p>
                <p className="text-xl font-black text-white">₹1.45L</p>
              </div>
              <div className="bg-black/20 rounded-2xl p-3 border border-white/20">
                <p className="text-[10px] text-white/80 uppercase font-mono font-bold">Reach</p>
                <p className="text-xl font-black text-white">2,800+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
