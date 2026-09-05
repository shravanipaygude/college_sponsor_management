import React, { useState, useEffect, useRef } from "react";
import { Search, Send, CheckCircle2, Clock, Handshake, CheckSquare, ShieldCheck, History, Megaphone, Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductJourneyStory() {
  const sectionRef = useRef(null);
  const mockupRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages = [
    {
      id: "discover",
      title: "1. DISCOVER OPPORTUNITIES",
      subtitle: "Committees and sponsors discover verified listings in real time.",
      badge: "Discovery",
    },
    {
      id: "approach",
      title: "2. APPROACH & REQUEST",
      subtitle: "Send structured partnership proposals with clear monetary and perk terms.",
      badge: "Proposal",
    },
    {
      id: "partnership",
      title: "3. CONFIRM & PARTNER",
      subtitle: "Review request, negotiate deliverables, and form official agreements.",
      badge: "Partnership",
    },
    {
      id: "history-proof",
      title: "4. HISTORY & PROOF AUDIT",
      subtitle: "Track deliverable proof & preserve sponsor contacts across committee years.",
      badge: "Continuity",
    },
  ];

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=160%",
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
      id="product-section"
      ref={sectionRef}
      className="relative min-h-[92vh] bg-[var(--bg-page)] text-[var(--text-primary)] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center border-b border-[var(--border-subtle)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8 w-full relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)]">
            Chapter 04 • Platform Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight">
            <span className="font-editorial italic font-bold text-[var(--brand-primary)]">From discovery to partnership.</span> <br className="hidden sm:inline" />
            <span>One continuous flow.</span>
          </h2>
        </div>

        {/* Stage Progress Bar Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap font-sans-ui">
          {stages.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStageIndex === idx
                  ? "bg-[var(--brand-primary)] text-white shadow-md scale-105"
                  : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)]/80 border border-[var(--border-subtle)]"
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>

        {/* Pinned Browser Mockup */}
        <div
          ref={mockupRef}
          className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-strong)] shadow-2xl overflow-hidden max-w-4xl mx-auto transition-all duration-500 font-sans-ui"
        >
          {/* Mock Browser Header */}
          <div className="bg-[var(--bg-surface-alt)] px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--accent-pink)]" />
              <span className="w-3 h-3 rounded-full bg-[var(--brand-royal)]" />
              <span className="w-3 h-3 rounded-full bg-[var(--brand-primary)]" />
              <div className="flex-1 bg-[var(--bg-surface-alt)] rounded-lg px-3 py-1 text-center font-mono text-[11px] text-[var(--text-secondary)] border border-[var(--border-subtle)] truncate">
                https://sponnect.app/{currentStage.id}
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border border-[var(--accent-pink)]/30">
              {currentStage.badge}
            </span>
          </div>

          {/* Dynamic Mockup Body */}
          <div className="p-6 sm:p-8 space-y-6 min-h-[360px] flex flex-col justify-between">
            
            {/* Stage Description Bar */}
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">{currentStage.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] font-medium">{currentStage.subtitle}</p>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] flex items-center justify-center font-bold shrink-0 border border-[var(--border-subtle)]">
                {activeStageIndex + 1}/4
              </span>
            </div>

            {/* Stage 1: DISCOVER */}
            {activeStageIndex === 0 && (
              <div className="bg-[var(--bg-surface-alt)]/60 p-5 rounded-2xl border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white font-bold flex items-center justify-center text-sm">
                      NA
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[var(--text-primary)]">NovaAI Technologies</h5>
                      <p className="text-[10px] font-mono text-[var(--brand-royal)]">PUBLISHED OPPORTUNITY</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[var(--accent-pink)]">₹50,000 Est. Value</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="px-2.5 py-1 bg-[var(--bg-card)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">Can Provide: ₹20,000 Support</span>
                  <span className="px-2.5 py-1 bg-[var(--bg-card)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">100 AI Credit Vouchers</span>
                </div>
              </div>
            )}

            {/* Stage 2: APPROACH & REQUEST */}
            {activeStageIndex === 1 && (
              <div className="bg-[var(--bg-surface-alt)]/60 p-5 rounded-2xl border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Partnership Proposal Modal</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[10px] text-[var(--brand-primary)] font-bold">CSI TechNext 2026</span>
                </div>
                <div className="space-y-2 text-xs text-[var(--text-primary)]">
                  <p className="font-semibold">Requesting: ₹20,000 Funding + 100 AI Credit Vouchers</p>
                  <p className="text-[var(--text-secondary)]">They Offer: Stage Branding + Instagram Story + Demo Booth</p>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[var(--brand-primary)] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                  <Send className="w-3.5 h-3.5" />
                  Send Partnership Proposal
                </button>
              </div>
            )}

            {/* Stage 3: CONFIRM & PARTNER */}
            {activeStageIndex === 2 && (
              <div className="bg-[var(--bg-surface-alt)]/60 p-5 rounded-2xl border border-[var(--border-subtle)] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-[var(--brand-royal)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">NovaAI × CSI TechNext 2026</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] text-[10px] font-mono font-bold border border-[var(--accent-pink)]/30">Agreed & Active</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Sponsor Provides</p>
                    <p className="text-[var(--text-primary)] font-semibold">₹20,000 + 100 AI Credits</p>
                  </div>
                  <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Committee Delivers</p>
                    <p className="text-[var(--text-primary)] font-semibold">Main Banner + IG Story</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4: HISTORY & PROOF AUDIT */}
            {activeStageIndex === 3 && (
              <div className="bg-[var(--bg-surface-alt)]/60 p-5 rounded-2xl border border-[var(--border-subtle)] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs font-bold text-[var(--brand-royal)]">
                  <span className="flex items-center gap-1.5"><History className="w-4 h-4 text-[var(--brand-royal)]" /> Institutional Memory & Audit</span>
                  <span className="font-mono text-[var(--accent-pink)]">NovaAI (2024-2026)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-primary)] font-semibold">2024 CodeStorm Partner</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] text-[10px] font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-primary)] font-semibold">2025 Workshop Partner</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] text-[10px] font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-primary)] font-semibold">2026 Recommended Sponsor ✦</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] text-[10px] font-bold">Recommended</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-royal)]" /> Structured End-to-End Workflow</span>
              <span className="font-mono text-[var(--brand-royal)]">Sponnect App</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
