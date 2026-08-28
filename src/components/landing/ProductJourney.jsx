import React, { useState, useEffect, useRef } from "react";
import { Search, Send, CheckCircle2, Clock, Handshake, CheckSquare, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductJourney() {
  const sectionRef = useRef(null);
  const mockupRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages = [
    {
      id: "discover",
      title: "1. DISCOVER",
      subtitle: "Browse brand sponsorship opportunities with transparent offering criteria.",
      badge: "Discovery Stage",
    },
    {
      id: "approach",
      title: "2. APPROACH & REQUEST",
      subtitle: "Committee selects event & sends structured partnership proposal.",
      badge: "Proposal Stage",
    },
    {
      id: "response",
      title: "3. SPONSOR RESPONSE",
      subtitle: "Sponsor receives proposal & confirms interest or initiates discussion.",
      badge: "Negotiation Stage",
    },
    {
      id: "partnership",
      title: "4. ACTIVE PARTNERSHIP",
      subtitle: "Both parties finalize deliverable terms & track deal milestones.",
      badge: "Agreement Stage",
    },
    {
      id: "deliverables",
      title: "5. PROOF & DELIVERABLES",
      subtitle: "Committee uploads proof photos/links; Sponsor reviews & approves.",
      badge: "Fulfillment Stage",
    },
  ];

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(
            stages.length - 1,
            Math.floor(self.progress * stages.length)
          );
          setActiveStageIndex(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stages.length]);

  const currentStage = stages[activeStageIndex];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#12081F] text-[#F8F4FC] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center border-b border-[#B99AE8]/20"
    >
      <div className="max-w-6xl mx-auto space-y-8 w-full relative z-10">
        
        {/* Section Heading with Editorial Typography */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#B99AE8] uppercase tracking-widest px-3 py-1 rounded-full bg-[#251445] border border-[#B99AE8]/30">
            Chapter 05 • The End-to-End System
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#F8F4FC] tracking-tight">
            <span className="font-editorial italic font-bold text-[#D8C9EE]">From discovery to partnership.</span> <br className="hidden sm:inline" />
            <span className="text-[#9859F6]">One continuous flow.</span>
          </h2>
        </div>

        {/* Stage Progress Bar Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap font-sans-ui">
          {stages.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStageIndex === idx
                  ? "bg-[#6D42C1] text-[#F8F4FC] shadow-lg scale-105 border border-[#B99AE8]/40"
                  : "bg-[#251445]/80 text-[#C9BADB] hover:bg-[#251445] border border-[#B99AE8]/20"
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>

        {/* Pinned Browser Mockup (Deep Purple Elevated Surface) */}
        <div
          ref={mockupRef}
          className="bg-[#1A1131] rounded-3xl border border-[#B99AE8]/40 shadow-2xl overflow-hidden max-w-4xl mx-auto transition-all duration-500 font-sans-ui"
        >
          {/* Mock Browser Header */}
          <div className="bg-[#12081F] px-6 py-3 border-b border-[#B99AE8]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF6FAE]" />
              <span className="w-3 h-3 rounded-full bg-[#B99AE8]" />
              <span className="w-3 h-3 rounded-full bg-[#6D42C1]" />
              <span className="text-xs font-mono text-[#B99AE8] ml-2 hidden sm:inline">
                https://sponsorflow.app/{currentStage.id}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#6D42C1]/30 text-[#FF9CC5] border border-[#FF6FAE]/30">
              {currentStage.badge}
            </span>
          </div>

          {/* Dynamic Mockup Body */}
          <div className="p-6 sm:p-8 space-y-6 min-h-[380px] flex flex-col justify-between">
            
            {/* Stage Description Bar */}
            <div className="bg-[#251445]/80 p-4 rounded-2xl border border-[#B99AE8]/30 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-[#F8F4FC]">{currentStage.title}</h4>
                <p className="text-xs text-[#C9BADB] font-medium">{currentStage.subtitle}</p>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#6D42C1]/30 text-[#B99AE8] flex items-center justify-center font-bold shrink-0 border border-[#B99AE8]/30">
                {activeStageIndex + 1}/5
              </span>
            </div>

            {/* Stage 1: DISCOVER */}
            {activeStageIndex === 0 && (
              <div className="bg-[#251445]/60 p-5 rounded-2xl border border-[#B99AE8]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#12081F] text-[#B99AE8] font-bold flex items-center justify-center border border-[#B99AE8]/30">
                      NA
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#F8F4FC]">NovaAI Technologies</h5>
                      <p className="text-[10px] font-mono text-[#B99AE8]">OPEN FOR COLLEGE SPONSORSHIPS</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[#FF9CC5]">₹50,000 Est. Value</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="px-2.5 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">Can Provide: ₹20,000 Support</span>
                  <span className="px-2.5 py-1 bg-[#12081F] rounded text-[#F8F4FC] font-medium border border-[#B99AE8]/20">100 AI Credit Vouchers</span>
                </div>
              </div>
            )}

            {/* Stage 2: APPROACH & REQUEST */}
            {activeStageIndex === 1 && (
              <div className="bg-[#251445]/60 p-5 rounded-2xl border border-[#B99AE8]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#B99AE8]/20 pb-3">
                  <span className="text-xs font-mono font-bold text-[#B99AE8] uppercase">Partnership Request Modal</span>
                  <span className="px-2 py-0.5 rounded bg-[#6D42C1]/30 text-[10px] text-[#F8F4FC]">CSI TechNext 2026</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-[#F8F4FC]/90 font-medium">Requesting: ₹20,000 Funding + 100 AI Credit Vouchers</p>
                  <p className="text-[#C9BADB]">They Offer: Stage Branding + Instagram Story + Demo Booth</p>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#6D42C1] text-[#F8F4FC] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                  <Send className="w-3.5 h-3.5" />
                  Send Partnership Proposal
                </button>
              </div>
            )}

            {/* Stage 3: SPONSOR RESPONSE */}
            {activeStageIndex === 2 && (
              <div className="bg-[#251445]/60 p-5 rounded-2xl border border-[#B99AE8]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B99AE8]" />
                    <span className="text-xs font-bold text-[#F8F4FC]">Request Status: Pending</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FF6FAE]/20 text-[10px] text-[#FF9CC5] font-bold border border-[#FF6FAE]/30">Received 2h ago</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-[#6D42C1] text-[#F8F4FC] font-bold text-xs flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm Interest
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-[#12081F] text-[#C9BADB] font-bold text-xs border border-[#B99AE8]/30">
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Stage 4: ACTIVE PARTNERSHIP */}
            {activeStageIndex === 3 && (
              <div className="bg-[#251445]/60 p-5 rounded-2xl border border-[#B99AE8]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-[#B99AE8]" />
                    <span className="text-xs font-bold text-[#F8F4FC] font-mono">NovaAI × CSI TechNext 2026</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#6D42C1]/30 text-[#B99AE8] text-[10px] font-mono font-bold">Negotiation / Agreed</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#12081F] p-3 rounded-xl border border-[#B99AE8]/20">
                    <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">Brand Provides</p>
                    <p className="text-[#F8F4FC] font-semibold">₹20,000 + 100 AI Credits</p>
                  </div>
                  <div className="bg-[#12081F] p-3 rounded-xl border border-[#B99AE8]/20">
                    <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">College Offers</p>
                    <p className="text-[#F8F4FC] font-semibold">Stage Branding + IG Post</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 5: PROOF & DELIVERABLES */}
            {(activeStageIndex === 4 || activeStageIndex === 5) && (
              <div className="bg-[#251445]/60 p-5 rounded-2xl border border-[#B99AE8]/20 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#B99AE8]/20 pb-2 text-xs font-bold text-[#B99AE8]">
                  <span className="flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-[#B99AE8]" /> Deliverable Proof Hub</span>
                  <span className="font-mono text-[#FF9CC5]">2 / 3 Completed</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-[#12081F] p-2.5 rounded-xl border border-[#B99AE8]/20">
                    <span className="text-[#F8F4FC] font-semibold">Main Stage Banner</span>
                    <span className="px-2 py-0.5 rounded bg-[#6D42C1]/30 text-[#B99AE8] text-[10px] font-bold">✓ Approved</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#12081F] p-2.5 rounded-xl border border-[#B99AE8]/20">
                    <span className="text-[#F8F4FC] font-semibold">Instagram Promotional Post</span>
                    <span className="px-2 py-0.5 rounded bg-[#6D42C1]/30 text-[#B99AE8] text-[10px] font-bold">✓ Approved</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#12081F] p-2.5 rounded-xl border border-[#B99AE8]/20">
                    <span className="text-[#F8F4FC] font-semibold">Product Demo Booth</span>
                    <span className="px-2 py-0.5 rounded bg-[#251445] text-[#C9BADB] text-[10px] font-bold">○ Pending Proof</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="pt-4 border-t border-[#B99AE8]/20 flex items-center justify-between text-[11px] text-[#C9BADB] font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#B99AE8]" /> Structured End-to-End Workflow</span>
              <span className="font-mono text-[#B99AE8]">SponsorFlow App</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
