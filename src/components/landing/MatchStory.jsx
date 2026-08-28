import React, { useEffect, useRef } from "react";
import { CheckCircle, Zap, Tag, Users, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MatchStory() {
  const sectionRef = useRef(null);
  const cardLeftRef = useRef(null);
  const cardRightRef = useRef(null);
  const matchBadgeRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 0.8,
        },
      });

      // Cards move toward each other
      tl.fromTo(cardLeftRef.current, { x: -80, opacity: 0.6 }, { x: 0, opacity: 1, duration: 1 });
      tl.fromTo(cardRightRef.current, { x: 80, opacity: 0.6 }, { x: 0, opacity: 1, duration: 1 }, "<");

      // Match badge reveals with subtle scale
      tl.fromTo(matchBadgeRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#12081F] text-[#F8F4FC] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center border-b border-[#B99AE8]/20"
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6D42C1]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10 w-full text-center">
        
        {/* Section Tagline */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-[#B99AE8] uppercase tracking-widest px-3 py-1 rounded-full bg-[#251445] border border-[#B99AE8]/30">
            Chapter 04 • Algorithmic Alignment
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#F8F4FC] tracking-tight">
            Match Found
          </h2>
          <p className="text-sm sm:text-base font-sans-ui text-[#C9BADB] max-w-lg mx-auto font-medium">
            SponsorFlow matches event requirements directly with brand program criteria.
          </p>
        </div>

        {/* Match Percentage Badge (Pink Accent Highlight) */}
        <div ref={matchBadgeRef} className="inline-flex flex-col items-center gap-1">
          <div className="px-6 py-2.5 rounded-full bg-[#FF6FAE] text-[#12081F] font-display font-black text-lg sm:text-2xl shadow-xl flex items-center gap-2 border border-[#FF9CC5] animate-pulse">
            <Zap className="w-5 h-5 fill-[#12081F]" />
            <span>92% MATCH FOUND</span>
            <Sparkles className="w-5 h-5 text-[#12081F] fill-[#12081F]" />
          </div>
          <span className="text-[11px] font-mono text-[#FF9CC5] font-semibold tracking-wider uppercase mt-1">
            High Compatibility Score
          </span>
        </div>

        {/* Cards Alignment Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-4xl mx-auto font-sans-ui">
          
          {/* Left Card: CSI TechNext Event */}
          <div
            ref={cardLeftRef}
            className="bg-[#251445]/95 text-[#F8F4FC] p-6 rounded-3xl border border-[#FF6FAE]/40 shadow-2xl text-left space-y-4 hover:border-[#FF6FAE]/70 transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#B99AE8]/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#12081F] text-[#B99AE8] font-bold flex items-center justify-center border border-[#B99AE8]/30">
                  VE
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F8F4FC]">CSI TechNext 2026</h3>
                  <p className="text-[11px] text-[#C9BADB] font-medium">VESIT • Technical Festival</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#6D42C1]/30 text-[#B99AE8]">Event Post</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-mono font-bold text-[#FF9CC5] uppercase mb-1">Looking For</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">₹20K Support</span>
                  <span className="px-2 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">100 AI Credits</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">Can Offer</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[#6D42C1]/20 rounded text-[#B99AE8] font-medium border border-[#B99AE8]/30">Main Stage Banner</span>
                  <span className="px-2 py-1 bg-[#6D42C1]/20 rounded text-[#B99AE8] font-medium border border-[#B99AE8]/30">Instagram Story</span>
                  <span className="px-2 py-1 bg-[#6D42C1]/20 rounded text-[#B99AE8] font-medium border border-[#B99AE8]/30">Demo Booth</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#B99AE8]/20 flex items-center justify-between text-[11px] text-[#C9BADB] font-semibold">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#B99AE8]" /> 500+ Expected</span>
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-[#B99AE8]" /> Hybrid</span>
            </div>
          </div>

          {/* Right Card: NovaAI Sponsor Opportunity */}
          <div
            ref={cardRightRef}
            className="bg-[#251445]/95 text-[#F8F4FC] p-6 rounded-3xl border border-[#FF6FAE]/40 shadow-2xl text-left space-y-4 hover:border-[#FF6FAE]/70 transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#B99AE8]/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#12081F] text-[#B99AE8] font-bold flex items-center justify-center border border-[#B99AE8]/30">
                  NA
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F8F4FC]">NovaAI Technologies</h3>
                  <p className="text-[11px] text-[#C9BADB] font-medium">Sponsorship Program</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#6D42C1]/30 text-[#B99AE8]">Sponsor</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">Can Provide</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[#6D42C1]/20 rounded text-[#B99AE8] font-medium border border-[#B99AE8]/30">₹20,000 Support</span>
                  <span className="px-2 py-1 bg-[#6D42C1]/20 rounded text-[#B99AE8] font-medium border border-[#B99AE8]/30">100 AI Credit Vouchers</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-[#FF9CC5] uppercase mb-1">Looking For</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">Student Reach</span>
                  <span className="px-2 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">Product Demo</span>
                  <span className="px-2 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">Stage Mention</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#B99AE8]/20 flex items-center justify-between text-[11px] text-[#C9BADB] font-semibold">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-[#FF6FAE]" /> Verified Partner</span>
              <span className="text-[#FF9CC5]">₹50,000 Est. Value</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
