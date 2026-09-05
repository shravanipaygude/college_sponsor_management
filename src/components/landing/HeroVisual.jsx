import React from "react";
import {
  Users,
  Building2,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowDownUp,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-xl mx-auto py-4">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-taupe/15 rounded-3xl blur-2xl transform -rotate-1 scale-95" />

      {/* Main Container Card */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-taupe/30 shadow-2xl space-y-6">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-taupe/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-taupe opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-espresso"></span>
            </span>
            <span className="text-xs font-bold text-espresso uppercase tracking-wider">
              Live Sponnect Match Visualizer
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-espresso/10 border border-taupe/30 text-[11px] font-bold text-espresso flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-espresso" /> Verified Partnership
          </div>
        </div>

        {/* 1. College Card */}
        <div className="group bg-offWhite/50 hover:bg-offWhite/80 rounded-2xl p-4 sm:p-5 border border-taupe/30 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brown uppercase tracking-wider">
                  College Committee
                </span>
                <h3 className="text-base sm:text-lg font-bold text-espresso leading-tight">
                  CSI TechNext 2026
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-taupe/20 text-espresso text-[11px] font-bold">
              500+ Attendees
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            {/* Looking For */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-taupe/20 space-y-1">
              <p className="text-[10px] font-bold text-brown uppercase">
                Looking For:
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-espresso text-offWhite font-semibold text-[11px]">
                  ₹50K Funding
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  AI Credits
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  Food Partner
                </span>
              </div>
            </div>

            {/* Can Offer */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-taupe/20 space-y-1">
              <p className="text-[10px] font-bold text-brown uppercase">
                Can Offer:
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-darkBrown text-offWhite font-semibold text-[11px]">
                  Stage Branding
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  Sponsor Booth
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  Social Promo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Connector Badge */}
        <div className="relative flex items-center justify-center my-[-8px]">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-taupe/40" />
          </div>
          <div className="relative px-4 py-2 bg-espresso text-offWhite rounded-full border-2 border-taupe text-xs font-black shadow-lg flex items-center gap-2 group hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-taupe animate-spin" style={{ animationDuration: '4s' }} />
            <span>MATCH &amp; CONNECT</span>
            <ArrowDownUp className="w-3.5 h-3.5 text-taupe" />
          </div>
        </div>

        {/* 2. Brand Card */}
        <div className="group bg-offWhite/50 hover:bg-offWhite/80 rounded-2xl p-4 sm:p-5 border border-taupe/30 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-darkBrown text-taupe flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brown uppercase tracking-wider">
                  Corporate Sponsor
                </span>
                <h3 className="text-base sm:text-lg font-bold text-espresso leading-tight">
                  NovaAI Technologies
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-espresso text-offWhite text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-taupe" /> Active Sponsor
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            {/* Can Provide */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-taupe/20 space-y-1">
              <p className="text-[10px] font-bold text-brown uppercase">
                Can Provide:
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-espresso text-offWhite font-semibold text-[11px]">
                  ₹20K Support
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  100 AI Credits
                </span>
              </div>
            </div>

            {/* Interested In */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-taupe/20 space-y-1">
              <p className="text-[10px] font-bold text-brown uppercase">
                Interested In:
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-darkBrown text-offWhite font-semibold text-[11px]">
                  Hackathons
                </span>
                <span className="px-2 py-0.5 rounded-md bg-taupe/20 text-espresso font-semibold text-[11px]">
                  Tech Festivals
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Mini Feature Pill */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-brown font-medium border-t border-taupe/20">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-espresso" /> Direct Deal Negotiation
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-espresso" /> Faculty Verified Terms
          </span>
        </div>

      </div>
    </div>
  );
}
