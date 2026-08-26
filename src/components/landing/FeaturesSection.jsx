import React from "react";
import {
  Search,
  Calendar,
  Filter,
  Bookmark,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  CheckSquare,
  Eye,
} from "lucide-react";

const features = [
  {
    title: "Sponsor Discovery",
    desc: "Browse companies actively looking to sponsor college events.",
    icon: Search,
  },
  {
    title: "Event Discovery",
    desc: "Find verified campus events seeking corporate partners.",
    icon: Calendar,
  },
  {
    title: "Smart Search & Filters",
    desc: "Filter by budget, event type, category, and sponsorship offer.",
    icon: Filter,
  },
  {
    title: "Saved Opportunities",
    desc: "Bookmark promising sponsors or events for quick access.",
    icon: Bookmark,
  },
  {
    title: "Two-Way Partnership Requests",
    desc: "Colleges or brands can initiate direct partnership interest.",
    icon: MessageSquare,
  },
  {
    title: "Deal Management",
    desc: "Finalize financial, non-cash, and deliverable commitments.",
    icon: FileCheck,
  },
  {
    title: "Faculty Approval",
    desc: "Submit agreements for official institutional review.",
    icon: CheckCircle2,
  },
  {
    title: "Deliverable Tracking",
    desc: "Monitor promised deliverables and milestone timelines.",
    icon: CheckSquare,
  },
  {
    title: "Proof Verification",
    desc: "Upload and review photos, links, or documents as proof.",
    icon: Eye,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-offWhite/40 relative border-t border-taupe/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            Comprehensive Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            Everything You Need in One Portal.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            Designed to replace fragmented chats and spreadsheets with a single, end-to-end management hub.
          </p>
        </div>

        {/* 3x3 Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-taupe/30 hover:border-taupe shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group"
              >
                <div className="w-11 h-11 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-espresso">
                  {feature.title}
                </h3>

                <p className="text-xs text-brown font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
