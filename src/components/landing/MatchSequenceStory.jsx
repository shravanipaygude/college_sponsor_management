import React, { useEffect, useRef } from "react";
import { Building2, Award, Zap, Sparkles, CheckCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MatchSequenceStory() {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const lineRef = useRef(null);
  const matchBadgeRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      // Cards move toward center
      tl.fromTo(leftCardRef.current, { x: -60, opacity: 0.7 }, { x: 0, opacity: 1, duration: 1 });
      tl.fromTo(rightCardRef.current, { x: 60, opacity: 0.7 }, { x: 0, opacity: 1, duration: 1 }, "<");

      // Draw connecting SVG line
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(lineRef.current, { strokeDashoffset: 0, duration: 0.8 }, "<");
      }

      // Match badge reveals with pop scale
      tl.fromTo(matchBadgeRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="match-section"
      ref={sectionRef}
      className="relative min-h-[90vh] bg-[var(--bg-surface)] text-[var(--text-primary)] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center border-b border-[var(--border-subtle)] transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-12 relative z-10 w-full text-center">
        
        {/* Section Tagline */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)]">
            Chapter 03 • Committee ↔ Sponsor Match
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight">
            There Was Always a Match.
          </h2>
          <p className="text-sm sm:text-base font-editorial italic text-[var(--text-secondary)] font-medium max-w-lg mx-auto">
            "They just needed a place to find each other."
          </p>
        </div>

        {/* Highlighted Match Percentage Badge (Pink Accent) */}
        <div ref={matchBadgeRef} className="inline-flex flex-col items-center gap-1">
          <div className="px-6 py-2.5 rounded-full bg-[var(--accent-pink)] text-white font-display font-black text-lg sm:text-2xl shadow-xl flex items-center gap-2 border border-[var(--accent-pink-soft)] animate-pulse">
            <Zap className="w-5 h-5 fill-white" />
            <span>92% MATCH FOUND</span>
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="text-[11px] font-mono text-[var(--accent-pink)] font-bold tracking-wider uppercase mt-1">
            Algorithmic Compatibility
          </span>
        </div>

        {/* Dual Cards Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-4xl mx-auto font-sans-ui text-left">
          
          {/* Left Card: College Committee Event */}
          <div
            ref={leftCardRef}
            className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--accent-pink)]/40 shadow-xl space-y-4 hover:border-[var(--accent-pink)] transition-all"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-alt)] text-[var(--brand-primary)] font-bold flex items-center justify-center border border-[var(--border-subtle)]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">CSI TechNext 2026</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">VESIT • Technical Festival</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-surface-alt)] text-[var(--brand-primary)]">College</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--accent-pink)] uppercase mb-1">We Need</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[var(--bg-surface-alt)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">₹20K Support</span>
                  <span className="px-2 py-1 bg-[var(--bg-surface-alt)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">100 AI Credits</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">We Offer</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[var(--brand-primary)]/10 rounded text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">Main Stage Banner</span>
                  <span className="px-2 py-1 bg-[var(--brand-primary)]/10 rounded text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">Instagram Story</span>
                  <span className="px-2 py-1 bg-[var(--brand-primary)]/10 rounded text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">Demo Booth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Corporate Sponsor */}
          <div
            ref={rightCardRef}
            className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--accent-pink)]/40 shadow-xl space-y-4 hover:border-[var(--accent-pink)] transition-all"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-alt)] text-[var(--brand-primary)] font-bold flex items-center justify-center border border-[var(--border-subtle)]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">NovaAI Technologies</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">Sponsorship Program</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-surface-alt)] text-[var(--brand-primary)]">Sponsor</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">We Provide</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[var(--brand-primary)]/10 rounded text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">₹20,000 Support</span>
                  <span className="px-2 py-1 bg-[var(--brand-primary)]/10 rounded text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">100 AI Credit Vouchers</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-[var(--accent-pink)] uppercase mb-1">We Look For</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-[var(--bg-surface-alt)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">Student Reach</span>
                  <span className="px-2 py-1 bg-[var(--bg-surface-alt)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">Product Demo</span>
                  <span className="px-2 py-1 bg-[var(--bg-surface-alt)] rounded text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">Stage Mention</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Animated Connecting SVG Line */}
        <div className="hidden lg:block w-full max-w-xs mx-auto h-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 20">
            <path
              ref={lineRef}
              d="M 0 10 L 300 10"
              fill="none"
              stroke="var(--accent-pink)"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>
        </div>

      </div>
    </section>
  );
}
