import React from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import HeroVisual from "./HeroVisual";

export default function HeroSection({ onNavigateToAuth }) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-taupe/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-espresso/10 border border-taupe/30 text-espresso text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-espresso" />
              <span>College Sponsorship Discovery &amp; Management</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-espresso tracking-tight leading-[1.1]">
              Where College Events Meet the{" "}
              <span className="relative inline-block text-taupe">
                Right Sponsors.
                <svg
                  className="absolute left-0 bottom-[-4px] w-full h-2 text-taupe/40"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 Q50,12 100,0"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-brown max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Sponnect connects college committees and brands to discover
              opportunities, build partnerships, get approvals, and manage
              sponsorships — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigateToAuth("register", "committee")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-taupe/30 group"
              >
                Find Sponsorships
                <ArrowRight className="w-4 h-4 text-taupe group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToAuth("register", "sponsor")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-white text-espresso hover:bg-offWhite border border-taupe/40 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Sponsor College Events
              </button>
            </div>

            {/* Sign In Link & Quick Trust Checklist */}
            <div className="pt-3 space-y-3">
              <p className="text-xs text-brown font-semibold">
                Already have an account?{" "}
                <button
                  onClick={() => onNavigateToAuth("login")}
                  className="text-espresso font-bold underline hover:text-darkBrown transition-colors"
                >
                  Sign In
                </button>
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-brown/80 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-espresso" /> Monetary &amp; Non-Cash
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-espresso" /> Faculty Oversight
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-espresso" /> Proof Verification
                </span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
