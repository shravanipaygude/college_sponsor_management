import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCtaSection({ onNavigateToAuth }) {
  return (
    <section className="py-20 bg-espresso text-offWhite relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 bg-taupe/10 rounded-full blur-3xl pointer-events-none scale-150" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-darkBrown border border-taupe/30 text-taupe text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-taupe" />
          <span>Join the SponsorFlow Network</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-offWhite tracking-tight max-w-3xl mx-auto leading-tight">
          Your Next Sponsorship Partnership Starts Here.
        </h2>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-offWhite/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Whether you're organizing the next big college event or looking to connect your brand with students, SponsorFlow brings both sides together.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigateToAuth("register", "committee")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-taupe text-espresso hover:bg-offWhite transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
          >
            Find Sponsors
            <ArrowRight className="w-4 h-4 text-espresso group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateToAuth("register", "sponsor")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-darkBrown text-offWhite hover:bg-brown border border-taupe/40 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            Sponsor an Event
          </button>
        </div>

        {/* Sign In Link */}
        <div className="pt-2">
          <p className="text-xs text-offWhite/70 font-semibold">
            Already on SponsorFlow?{" "}
            <button
              onClick={() => onNavigateToAuth("login")}
              className="text-taupe font-bold underline hover:text-offWhite transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </section>
  );
}
