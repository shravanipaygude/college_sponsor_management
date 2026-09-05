import React from "react";
import { Sparkles, Users, Building2, CheckCircle2, ArrowRightLeft, ShieldCheck } from "lucide-react";

export default function MatchPreviewSection() {
  return (
    <section className="py-20 bg-offWhite/50 relative border-y border-taupe/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            Smart Relevance &amp; Match Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            See the Right Opportunities Faster.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            Sponnect highlights relevant matches based on budget, non-monetary requirements, event category, and promotional deliverables.
          </p>
        </div>

        {/* Mock Match Card Visual */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-taupe/30 shadow-2xl relative">
          
          {/* Top Bar Badge */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-taupe/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-espresso" />
              <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                System Match Preview Demo
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-espresso text-offWhite text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-taupe" />
              <span>96% Strong Match</span>
            </div>
          </div>

          {/* Connected Grid: College | Match Badge | Brand */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* Left: College Side */}
            <div className="lg:col-span-5 bg-offWhite/50 rounded-2xl p-5 border border-taupe/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-espresso">
                    CSI TechNext 2026
                  </h3>
                  <p className="text-xs text-brown font-medium">
                    Technical Festival &bull; 500+ Participants
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-taupe/20">
                  <p className="text-[10px] font-bold text-brown uppercase mb-1">
                    Needs:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-espresso text-offWhite font-semibold">
                      AI Credits
                    </span>
                    <span className="px-2 py-0.5 rounded bg-taupe/20 text-espresso font-semibold">
                      ₹30K–₹50K
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-taupe/20">
                  <p className="text-[10px] font-bold text-brown uppercase mb-1">
                    Offers:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-darkBrown text-offWhite font-semibold">
                      Stage Branding
                    </span>
                    <span className="px-2 py-0.5 rounded bg-taupe/20 text-espresso font-semibold">
                      Product Demo
                    </span>
                    <span className="px-2 py-0.5 rounded bg-taupe/20 text-espresso font-semibold">
                      Social Promotion
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Match Connector Indicator */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-full bg-espresso text-taupe flex items-center justify-center border-2 border-taupe shadow-md group hover:rotate-180 transition-transform duration-500 cursor-pointer">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-brown uppercase mt-2">
                Matched
              </span>
            </div>

            {/* Right: Brand Side */}
            <div className="lg:col-span-5 bg-offWhite/50 rounded-2xl p-5 border border-taupe/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-darkBrown text-taupe flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-espresso">
                    NovaAI Technologies
                  </h3>
                  <p className="text-xs text-brown font-medium">
                    Corporate Sponsor &bull; AI Industry
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-taupe/20">
                  <p className="text-[10px] font-bold text-brown uppercase mb-1">
                    Provides:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-espresso text-offWhite font-semibold">
                      AI Credits
                    </span>
                    <span className="px-2 py-0.5 rounded bg-taupe/20 text-espresso font-semibold">
                      ₹20K Support
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-taupe/20">
                  <p className="text-[10px] font-bold text-brown uppercase mb-1">
                    Interested In:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-darkBrown text-offWhite font-semibold">
                      Hackathons
                    </span>
                    <span className="px-2 py-0.5 rounded bg-taupe/20 text-espresso font-semibold">
                      Technical Festivals
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-taupe/20 text-center text-xs text-brown font-medium">
            <span className="inline-flex items-center gap-1 font-bold text-espresso">
              <ShieldCheck className="w-4 h-4" /> Instant Discovery:
            </span>{" "}
            Both parties can view detailed proposal terms and send direct partnership requests with a single click.
          </div>

        </div>

      </div>
    </section>
  );
}
