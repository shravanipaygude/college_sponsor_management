import React, { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { WhatsAppCard, EmailCard, SpreadsheetCard, ContactCard, StickyNote, DmCard } from "./FloatingElements";
import { gsap } from "gsap";

export default function HeroStory({ onNavigateToAuth }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    // Mouse tilt effect on floating elements
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 24;
      const y = (clientY / innerHeight - 0.5) * 24;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const speed = (index % 3 + 1) * 0.35;
        gsap.to(card, {
          x: x * speed,
          y: y * speed,
          duration: 1,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between overflow-hidden pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] transition-colors duration-300"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-royal)]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[var(--accent-pink)]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Chaos Cards (Desktop & Tablet) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block overflow-hidden">
        {/* Top Left WhatsApp */}
        <div ref={addToCardsRef} className="absolute top-20 left-[4%] rotate-[-6deg]">
          <WhatsAppCard text="Hey, did we contact NovaAI for sponsorships?" time="11:42 AM" />
        </div>

        {/* Top Right Email */}
        <div ref={addToCardsRef} className="absolute top-24 right-[5%] rotate-[4deg]">
          <EmailCard subject="Sponsorship Proposal — Follow Up #3" from="committee@vesit.edu" />
        </div>

        {/* Mid Left Spreadsheet */}
        <div ref={addToCardsRef} className="absolute top-[48%] left-[2%] rotate-[5deg]">
          <SpreadsheetCard title="SPONSOR_LIST_2025_v2.xlsx" status="Stale Contacts" />
        </div>

        {/* Mid Right Contact */}
        <div ref={addToCardsRef} className="absolute top-[52%] right-[3%] rotate-[-5deg]">
          <ContactCard name="Last contacted: 2 years ago" status="Person left company (?)" />
        </div>

        {/* Bottom Left Sticky Note */}
        <div ref={addToCardsRef} className="absolute bottom-24 left-[6%] rotate-[-3deg]">
          <StickyNote text="Who sponsored the Hackathon stage last year?" />
        </div>

        {/* Bottom Right DM */}
        <div ref={addToCardsRef} className="absolute bottom-20 right-[8%] rotate-[7deg]">
          <DmCard platform="Instagram DM" text="Seen 3 weeks ago • No reply" />
        </div>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto my-auto text-center space-y-8 px-2 sm:px-0">
        
        {/* Story Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-strong)] text-[var(--brand-primary)] text-xs font-sans-ui font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)]" />
          <span>The College Sponsorship Platform</span>
        </div>

        {/* Main Editorial Headline (KUNSTRAUB Impact + MODERN PRESTIGE Elegance + Pink Accent) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7.5xl font-display font-black tracking-tight leading-[1.06] text-[var(--text-primary)]">
          Great partnerships <br className="hidden sm:inline" />
          shouldn't{" "}
          <span className="font-editorial italic font-bold text-[var(--accent-pink)] underline decoration-[var(--accent-pink)]/30 underline-offset-8">
            get lost in the noise.
          </span>
        </h1>

        {/* Calligraphic Story Sentence (Strictly 2 Lines) */}
        <p className="font-script text-2.5xl sm:text-3.5xl lg:text-4xl text-[var(--brand-primary)] max-w-4xl mx-auto font-medium leading-relaxed tracking-wide px-2">
          "Sponnect brings college committees and corporate sponsors <br className="hidden sm:inline" />
          into one organized, transparent sponsorship network."
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-sans-ui">
          <button
            onClick={() => onNavigateToAuth("register", "committee")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--brand-primary)] text-white font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group border border-[var(--border-strong)] cursor-pointer"
          >
            <span>I'm a Committee</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateToAuth("register", "sponsor")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--bg-surface-alt)] text-[var(--text-primary)] font-bold text-sm hover:border-[var(--brand-primary)] transition-all duration-300 shadow-md flex items-center justify-center gap-2 border border-[var(--border-strong)] group cursor-pointer"
          >
            <span>I'm a Sponsor</span>
            <ArrowRight className="w-4 h-4 text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile floating cards fallback */}
        <div className="sm:hidden grid grid-cols-1 gap-3 pt-6 text-left">
          <WhatsAppCard text="Hey, did we contact NovaAI?" time="11:42 AM" />
          <StickyNote text="Who sponsored us last year?" />
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <div className="relative z-20 text-center pt-4">
        <div
          onClick={() => {
            const el = document.getElementById("chaos-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex flex-col items-center gap-1.5 text-xs font-sans-ui font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
        >
          <span>Scroll to discover</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[var(--brand-primary)]" />
        </div>
      </div>
    </section>
  );
}
