import React, { useEffect, useRef } from "react";
import { Award, CheckCircle2, Inbox, Handshake, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SponsorFlowReveal() {
  const sectionRef = useRef(null);
  const questionRef = useRef(null);
  const brandTitleRef = useRef(null);
  const hubCardRef = useRef(null);
  const convergingNodesRef = useRef([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      // 1. Question fades in
      tl.fromTo(questionRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 });

      // 2. Brand title reveals
      tl.fromTo(
        brandTitleRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.3)" }
      );

      // 3. Central Hub Card scales up
      tl.fromTo(hubCardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });

      // 4. Converging nodes pull into the center
      convergingNodesRef.current.forEach((node, i) => {
        if (!node) return;
        const directions = [
          { x: -80, y: -40 },
          { x: 80, y: -40 },
          { x: -80, y: 40 },
          { x: 80, y: 40 },
        ];
        const dir = directions[i % directions.length];
        tl.fromTo(
          node,
          { x: dir.x, y: dir.y, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.8 },
          "<"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToNodes = (el) => {
    if (el && !convergingNodesRef.current.includes(el)) {
      convergingNodesRef.current.push(el);
    }
  };

  const hubFeatures = [
    { icon: Inbox, title: "Structured Requests", desc: "No lost WhatsApp DMs" },
    { icon: Handshake, title: "Active Partnerships", desc: "Negotiation tracking" },
    { icon: ShieldCheck, title: "Faculty Approvals", desc: "Audit-ready compliance" },
    { icon: Zap, title: "Deliverables & Proof", desc: "Verifiable benefits" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] bg-[var(--bg-page)] text-[var(--text-primary)] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center border-b border-[var(--border-subtle)] transition-colors duration-300"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--brand-royal)]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto text-center space-y-10">
        {/* Transitional Question */}
        <div ref={questionRef} className="space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-primary)] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)]">
            Chapter 02 • The Turn
          </span>
          <h3 className="text-2xl sm:text-4xl font-editorial italic font-bold text-[var(--brand-primary)] tracking-tight">
            "What if all of it had one place?"
          </h3>
        </div>

        {/* Brand Name Reveal */}
        <div ref={brandTitleRef} className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-primary)] text-white shadow-2xl mx-auto mb-2 border border-[var(--border-strong)]">
            <Award className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-6xl sm:text-8xl lg:text-9xl font-display font-black text-[var(--text-primary)] tracking-tighter flex items-center justify-center gap-2">
            <span>Spon<span className="text-[var(--brand-royal)]">nect</span></span>
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--accent-pink)] fill-[var(--accent-pink)] animate-pulse" />
          </h2>
          <p className="text-base sm:text-xl font-sans-ui text-[var(--text-secondary)] font-semibold max-w-xl mx-auto">
            Chaos transformed into structured, transparent sponsorship management.
          </p>
        </div>

        {/* Central Hub Card (Convergence Target) */}
        <div
          ref={hubCardRef}
          className="bg-[var(--bg-card)] p-8 sm:p-10 rounded-3xl border border-[var(--border-strong)] shadow-2xl max-w-3xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 text-xs font-mono font-bold text-[var(--brand-royal)]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-royal)]" />
              CONVERGED SYSTEM
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border border-[var(--accent-pink)]/30 font-bold">100% ORGANIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left font-sans-ui">
            {hubFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  ref={addToNodes}
                  className="bg-[var(--bg-surface-alt)] p-4.5 rounded-2xl border border-[var(--border-subtle)] space-y-1.5 hover:border-[var(--brand-primary)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] flex items-center justify-center font-bold border border-[var(--border-subtle)]">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] text-base">{item.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
