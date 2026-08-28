import React, { useEffect, useRef } from "react";
import { WhatsAppCard, EmailCard, SpreadsheetCard, ContactCard, UnreadBadge, StickyNote } from "./FloatingElements";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ChaosStory() {
  const sectionRef = useRef(null);
  const cardsLayerRef = useRef(null);
  const textItemsRef = useRef([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate text items sequentially on scroll with tight scrub distance
      textItemsRef.current.forEach((textEl) => {
        if (!textEl) return;
        gsap.fromTo(
          textEl,
          { opacity: 0.2, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textEl,
              start: "top 85%",
              end: "top 50%",
              scrub: 0.3,
            },
          }
        );
      });

      // Parallax scroll on chaotic cards layer
      if (cardsLayerRef.current) {
        gsap.to(cardsLayerRef.current.children, {
          y: (i) => (i % 2 === 0 ? -60 : 60),
          rotation: (i) => (i % 2 === 0 ? 8 : -8),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToTextRef = (el) => {
    if (el && !textItemsRef.current.includes(el)) {
      textItemsRef.current.push(el);
    }
  };

  const statements = [
    { title: "Messages go unseen.", subtitle: "Proposals lost in endless WhatsApp groups and unread email threads." },
    { title: "Old contacts get forgotten.", subtitle: "Every year, new committee members lose previous brand relationships." },
    { title: "Opportunities get missed.", subtitle: "Sponsors publish programs that committees never discover in time." },
  ];

  return (
    <section
      id="chaos-section"
      ref={sectionRef}
      className="relative min-h-[85vh] bg-[var(--bg-surface)] text-[var(--text-primary)] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[var(--border-subtle)] transition-colors duration-300"
    >
      {/* Background Section Title Accent */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] sm:text-[160px] font-display font-black text-[var(--text-primary)]/5 select-none pointer-events-none tracking-tighter whitespace-nowrap">
        THE CHAOS
      </div>

      {/* Floating Chaos Layer (Muted Surrounding Content) */}
      <div ref={cardsLayerRef} className="absolute inset-0 pointer-events-none z-10 hidden md:block overflow-hidden opacity-60">
        <WhatsAppCard text="Followed up 4 times... no reply." time="Yesterday" className="absolute top-24 left-[4%] rotate-[-8deg]" />
        <EmailCard subject="RE: Sponsorship Deck (Final_v2)" from="marketing@brand.com" className="absolute top-52 right-[5%] rotate-[6deg]" />
        <SpreadsheetCard title="Sponsors_Master_Sheet_2024.xlsx" status="Outdated Emails" className="absolute top-[45%] left-[2%] rotate-[10deg]" />
        <UnreadBadge count="42 Unread Sponsorship Proposals" className="absolute top-[50%] right-[3%] rotate-[-5deg]" />
        <ContactCard name="Brand Manager: Resigned last month" status="Contact Broken" className="absolute top-[70%] left-[5%] rotate-[-6deg]" />
        <StickyNote text="Does anyone have Red Bull's contact?" className="absolute top-[80%] right-[6%] rotate-[8deg]" />
      </div>

      {/* Center Scrolling Narrative */}
      <div className="relative z-20 max-w-3xl mx-auto space-y-20 py-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)]">
            Chapter 01 • The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight">
            How Sponsorships Are Handled Today
          </h2>
        </div>

        <div className="space-y-16">
          {statements.map((st, index) => (
            <div
              key={index}
              ref={addToTextRef}
              className="bg-[var(--bg-card)] p-8 sm:p-10 rounded-3xl border border-[var(--border-strong)] shadow-xl space-y-3 hover:border-[var(--brand-primary)] transition-colors"
            >
              <div className="flex items-center gap-3 text-[var(--brand-royal)] font-mono text-xs font-bold">
                <span className="w-7 h-7 rounded-xl bg-[var(--accent-pink-bg)] flex items-center justify-center border border-[var(--accent-pink)]/30 text-[var(--accent-pink)]">
                  0{index + 1}
                </span>
                <span>CHALLENGE</span>
              </div>

              <h3 className="text-2.5xl sm:text-4xl font-display font-black text-[var(--text-primary)] leading-tight">
                {st.title}
              </h3>

              <p className="text-sm sm:text-base font-sans-ui text-[var(--text-secondary)] font-medium leading-relaxed">
                {st.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
