import React from "react";
import { TrendingUp, Calendar, Users, Eye } from "lucide-react";
import StatCard from "../common/StatCard";
import { brandStats, recommendedEvents, brandPartnerships } from "../../data/mockData";

export default function SponsorDashboard({ onNavigate }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatCard stats={brandStats} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Events */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-taupe/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-espresso">Recommended College Events</h3>
            <button
              onClick={() => onNavigate("discover_events")}
              className="text-xs font-bold text-brown hover:text-espresso transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recommendedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-offWhite/50 border border-taupe/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-espresso text-taupe flex items-center justify-center font-bold text-xs">
                    {event.college.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-espresso">{event.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-brown mt-0.5">
                      <span>{event.college}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3" />
                        {event.participants}
                      </span>
                      <span>•</span>
                      <span>{event.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-taupe/20 text-espresso border border-taupe/30">
                    {event.match} match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Partnership Activity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-taupe/30 shadow-sm">
            <h3 className="text-lg font-bold text-espresso mb-4">Active Deals</h3>
            <div className="space-y-3">
              {brandPartnerships.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-taupe/15 hover:bg-offWhite/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-espresso">{p.eventName}</h4>
                      <p className="text-[10px] text-brown">{p.collegeName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      p.status === "Approved" ? "bg-taupe/30 text-espresso border-taupe/50" :
                      p.status === "Deal Agreed" ? "bg-espresso/10 text-espresso border-espresso/30" :
                      "bg-offWhite text-brown border-taupe/40"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-brown mt-1">Value: {p.estimatedValue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-espresso rounded-2xl p-6 text-offWhite border border-taupe/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-taupe" />
              <h3 className="text-sm font-bold">Sponsorship Impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-darkBrown/60 rounded-lg p-3 border border-taupe/15">
                <p className="text-[10px] text-taupe uppercase font-bold">Total Invested</p>
                <p className="text-xl font-black text-offWhite">₹1.45L</p>
              </div>
              <div className="bg-darkBrown/60 rounded-lg p-3 border border-taupe/15">
                <p className="text-[10px] text-taupe uppercase font-bold">Reach</p>
                <p className="text-xl font-black text-offWhite">2,800+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
