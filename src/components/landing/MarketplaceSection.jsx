import React from "react";
import { Users, Building2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function MarketplaceSection({ onNavigateToAuth }) {
  const committeeFeatures = [
    "Post what your event needs",
    "Define what your committee can offer",
    "Discover brands open to college partnerships",
    "Search & filter relevant sponsors",
    "Save promising sponsors",
    "Approach brands directly",
    "Manage partnerships and deals",
    "Track approvals and deliverables",
  ];

  const sponsorFeatures = [
    "Post sponsorship opportunities",
    "Offer money, products, credits or services",
    "Define what you expect in return",
    "Discover relevant college events",
    "Save promising events",
    "Receive partnership requests",
    "Manage deals",
    "Review deliverable proof",
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-taupe/20 text-espresso text-xs font-bold uppercase tracking-wider">
            Two-Sided Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            Built for Both Sides of the Partnership.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            Whether you are a student committee seeking resources or a brand looking for targeted student engagement, SponsorFlow empowers your goals.
          </p>
        </div>

        {/* Two Large Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* 1. FOR COLLEGE COMMITTEES */}
          <div
            id="for-colleges"
            className="bg-offWhite/40 rounded-3xl p-8 sm:p-10 border-2 border-taupe/30 hover:border-taupe flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl relative group"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-espresso text-taupe flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-espresso text-offWhite text-xs font-bold uppercase tracking-wider">
                  For Student Committees
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-brown uppercase tracking-wider">
                  College Head Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-espresso mt-1 leading-tight">
                  Find brands that actually want to sponsor.
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3 pt-2">
                {committeeFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-semibold text-darkBrown">
                    <CheckCircle2 className="w-5 h-5 text-espresso shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-taupe/30 mt-8">
              <button
                onClick={() => onNavigateToAuth("register", "committee")}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Join as a Committee
                <ArrowRight className="w-4 h-4 text-taupe transition-all" />
              </button>
            </div>
          </div>

          {/* 2. FOR BRANDS */}
          <div
            id="for-sponsors"
            className="bg-darkBrown text-offWhite rounded-3xl p-8 sm:p-10 border-2 border-taupe/40 hover:border-taupe flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl relative group"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-taupe text-espresso flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-taupe text-espresso text-xs font-bold uppercase tracking-wider">
                  For Corporate Sponsors
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-taupe uppercase tracking-wider">
                  Brand &amp; Sponsor Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-offWhite mt-1 leading-tight">
                  Discover college events worth supporting.
                </h3>
              </div>

              {/* Checklist */}
              <ul className="space-y-3 pt-2">
                {sponsorFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-semibold text-offWhite/90">
                    <CheckCircle2 className="w-5 h-5 text-taupe shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-taupe/30 mt-8">
              <button
                onClick={() => onNavigateToAuth("register", "sponsor")}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-taupe text-espresso hover:bg-offWhite transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Join as a Sponsor
                <ArrowRight className="w-4 h-4 text-espresso transition-all" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
