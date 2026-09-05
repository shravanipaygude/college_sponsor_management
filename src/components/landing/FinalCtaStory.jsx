import React, { useRef, useEffect } from "react";
import { ArrowRight, Award, Sparkles, CheckCircle2, Search, Inbox, Handshake, History } from "lucide-react";
import { gsap } from "gsap";

export default function FinalCtaStory({ onNavigateToAuth }) {
  const btn1Ref = useRef(null);
  const btn2Ref = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    // Magnetic hover interaction on CTA buttons
    const applyMagnetic = (btnRef) => {
      const btn = btnRef.current;
      if (!btn) return;

      const handleMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        gsap.to(btn, {
          x: x * 0.22,
          y: y * 0.22,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      };

      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        btn.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const cleanup1 = applyMagnetic(btn1Ref);
    const cleanup2 = applyMagnetic(btn2Ref);

    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    };
  }, []);

  return (
    <section className="relative min-h-[85vh] bg-[var(--bg-page)] text-[var(--text-primary)] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-between border-b border-[var(--border-subtle)] transition-colors duration-300">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[var(--brand-royal)]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto text-center space-y-8 font-sans-ui">
        
        {/* Transformation Statement */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)]">
            Final Chapter • Complete Alignment
          </span>
          <h3 className="text-4xl sm:text-6xl font-display font-black text-[var(--text-primary)] tracking-tight">
            "Less chasing. <span className="font-editorial italic font-bold text-[var(--accent-pink)]">More partnering."</span>
          </h3>
        </div>

        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-strong)] text-[var(--brand-primary)] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
          <Award className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>Sponnect Network</span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)]" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[var(--text-primary)] tracking-tight leading-[1.1]">
          Your next partnership <br className="hidden sm:inline" />
          <span className="font-editorial italic font-bold text-[var(--accent-pink)]">might already be here.</span>
        </h2>

        {/* Narrative Copy */}
        <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-xl mx-auto font-medium leading-relaxed">
          Join college committees and corporate sponsors structuring their sponsorship workflow today.
        </p>

        {/* Two Large Magnetic CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-sans-ui">
          <button
            ref={btn1Ref}
            onClick={() => onNavigateToAuth("register", "committee")}
            className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-[var(--brand-primary)] text-white font-black text-base hover:opacity-90 transition-colors duration-300 shadow-2xl flex items-center justify-center gap-3 group border border-[var(--border-strong)] cursor-pointer"
          >
            <span>I'm a Committee</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            ref={btn2Ref}
            onClick={() => onNavigateToAuth("register", "sponsor")}
            className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-[var(--bg-surface-alt)] text-[var(--text-primary)] font-black text-base hover:border-[var(--brand-primary)] transition-colors duration-300 shadow-xl flex items-center justify-center gap-3 border border-[var(--border-strong)] group cursor-pointer"
          >
            <span>I'm a Sponsor</span>
            <ArrowRight className="w-5 h-5 text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Secondary Login Action */}
        <div className="pt-2">
          <p className="text-xs text-[var(--text-secondary)] font-semibold">
            Already have an account?{" "}
            <button
              onClick={() => onNavigateToAuth("login")}
              className="text-[var(--accent-pink)] hover:underline font-bold"
            >
              Sign In Here
            </button>
          </p>
        </div>
      </div>

      {/* Brand Sign-off Footer Line */}
      <div className="relative z-10 text-center pt-6 border-t border-[var(--border-subtle)] font-sans-ui">
        <p className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">
          Sponnect • <span className="font-editorial italic font-normal text-[var(--text-primary)]">"Where opportunities meet impact."</span>
        </p>
      </div>
    </section>
  );
}
