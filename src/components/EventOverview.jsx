import React from "react";
import { Calendar, MapPin, Sparkles, Eye, Settings } from "lucide-react";
import { eventData } from "../data/mockData";

export default function EventOverview({ onQuickAction }) {
  const percentage = Math.round(
    (eventData.raisedAmount / eventData.goalAmount) * 100
  );

  return (
    <div className="bg-espresso text-offWhite rounded-2xl p-6 sm:p-8 shadow-md border border-taupe/20 relative overflow-hidden">
      {/* Background Subtle Accent Decoration */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-taupe/5 blur-2xl pointer-events-none" />
      <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-brown/10 blur-xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Event Specs & Buttons */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-taupe/20 text-taupe border border-taupe/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Event Status: {eventData.status}
            </span>
            <span className="text-xs text-taupe/80 font-medium">
              Annual Flagship Tech Fest
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-offWhite tracking-tight">
              {eventData.name}
            </h2>
            <p className="text-sm text-taupe/90 mt-1 max-w-xl">
              Central Sponsorship Tracking & Corporate Relations Portal for Computer Society of India (VESIT Chapter).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-taupe/90 pt-1">
            <div className="flex items-center gap-1.5 bg-darkBrown/60 px-3 py-1.5 rounded-lg border border-taupe/15">
              <Calendar className="w-4 h-4 text-taupe" />
              <span>{eventData.date}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-darkBrown/60 px-3 py-1.5 rounded-lg border border-taupe/15">
              <MapPin className="w-4 h-4 text-taupe" />
              <span>{eventData.venue}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onQuickAction("view_event")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-taupe text-espresso hover:bg-offWhite transition-all duration-200 shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>View Event</span>
            </button>

            <button
              onClick={() => onQuickAction("manage_event")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-darkBrown text-offWhite border border-taupe/30 hover:bg-brown/40 transition-all duration-200"
            >
              <Settings className="w-4 h-4 text-taupe" />
              <span>Manage Event</span>
            </button>
          </div>
        </div>

        {/* Right Column: Sponsorship Progress Card */}
        <div className="lg:col-span-5 bg-darkBrown/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-taupe/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-taupe uppercase tracking-wider">
              Sponsorship Goal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-taupe text-espresso">
              {percentage}% Achieved
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-offWhite">
                ₹{eventData.raisedAmount.toLocaleString("en-IN")}
              </h3>
              <span className="text-xs text-taupe">
                Goal: ₹{eventData.goalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-taupe/70">
              Raised across 12 confirmed & partner sponsors
            </p>
          </div>

          {/* Progress Bar in strict palette */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-espresso p-0.5 border border-taupe/30">
              <div
                className="h-full rounded-full bg-taupe transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-taupe font-medium">
              <span>₹0</span>
              <span>₹2.0L</span>
              <span>Target ₹4.0L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
