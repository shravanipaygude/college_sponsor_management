import React from "react";
import { Calendar, MapPin, Sparkles, Eye, Settings, Users } from "lucide-react";
import StatCard from "../common/StatCard";
import { eventData, committeeStats, recentActivities } from "../../data/mockData";

/**
 * Committee Head Dashboard.
 * Displays event overview, metric cards, and recent activity using CSS theme variables.
 */
export default function CommitteeDashboard({ onNavigate }) {
  const percentage = Math.round((eventData.raisedAmount / eventData.goalAmount) * 100);

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Hero / Event Overview */}
      <div className="bg-[var(--brand-primary)] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[var(--border-strong)] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)]" />
                {eventData.sponsorshipStatus}
              </span>
              <span className="text-xs text-white/80 font-medium">
                {eventData.type}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-sans-ui font-extrabold text-white tracking-tight">
                {eventData.name}
              </h2>
              <p className="text-sm text-white/90 mt-1 max-w-xl font-medium">
                {eventData.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 pt-1">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                <Calendar className="w-4 h-4 text-white" />
                <span>{eventData.date}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                <MapPin className="w-4 h-4 text-white" />
                <span>{eventData.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                <Users className="w-4 h-4 text-white" />
                <span>{eventData.expectedParticipants} Expected</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate("my_events")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[var(--brand-primary)] hover:bg-white/90 transition-all duration-200 shadow-md cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Manage Event</span>
              </button>
              <button
                onClick={() => onNavigate("sponsorship_posts")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-black/25 text-white border border-white/30 hover:bg-black/40 transition-all duration-200 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-white" />
                <span>View Sponsorship Post</span>
              </button>
            </div>
          </div>

          {/* Sponsorship Progress */}
          <div className="lg:col-span-5 bg-black/25 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider">
                Sponsorship Goal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-[var(--brand-primary)]">
                {percentage}% Achieved
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-white">
                  ₹{eventData.raisedAmount.toLocaleString("en-IN")}
                </h3>
                <span className="text-xs text-white/80">
                  Goal: ₹{eventData.goalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                Raised across 12 confirmed & partner sponsors
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-black/30 p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/80 font-medium">
                <span>₹0</span>
                <span>₹2.0L</span>
                <span>Target ₹4.0L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatCard stats={committeeStats} />

      {/* Recent Activity */}
      <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Activity</h3>
        <div className="space-y-2.5">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-surface-alt)] transition-colors">
              <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-[var(--brand-primary)]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-primary)] font-medium">{activity.text}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
