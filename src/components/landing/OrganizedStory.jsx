import React, { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Inbox, Search, Handshake, History, Megaphone, CheckSquare } from "lucide-react";
import { WhatsAppCard, EmailCard, SpreadsheetCard, ContactCard } from "./FloatingElements";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrganizedStory() {
  const sectionRef = useRef(null);
  const leftChaosRef = useRef(null);
  const rightOrganizedRef = useRef(null);
  const statementRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.8,
        },
      });

      // Left chaos elements scale down/fade, right organized elements scale up/fade in
      tl.fromTo(leftChaosRef.current, { opacity: 0.8, scale: 1 }, { opacity: 0.3, scale: 0.9, duration: 1 });
      tl.fromTo(rightOrganizedRef.current, { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "<");
      tl.fromTo(statementRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const organizedModules = [
    { icon: Search, title: "Structured Discovery", desc: "Browse verified opportunities & events" },
    { icon: Inbox, title: "Central Request Inbox", desc: "No unread messages or lost emails" },
    { icon: Handshake, title: "Negotiation Tracker", desc: "Clear terms for funding & perks" },
    { icon: History, title: "Sponsor Relationship History", desc: "Persistent institutional memory" },
    { icon: Megaphone, title: "Brand Opportunities", desc: "Proactive sponsor publishing" },
    { icon: CheckSquare, title: "Deliverable Proof Audit", desc: "Faculty-ready deliverable tracking" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#2B1854] text-[#F8F4FC] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D8C9EE]/20"
    >
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#D8C9EE] uppercase tracking-widest px-3 py-1 rounded-full bg-[#4B2B8F]/80 border border-[#D8C9EE]/30">
            Chapter 08 • Complete Transformation
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#F8F4FC] tracking-tight">
            Everything in Its Place
          </h2>
        </div>

        {/* Side-by-Side Transformation Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center font-sans-ui">
          
          {/* Left: Scattered Chaos (Fading Out) */}
          <div
            ref={leftChaosRef}
            className="bg-[#1A1131]/60 p-8 rounded-3xl border border-[#B99AE8]/20 space-y-4 opacity-50 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#B99AE8]/20 pb-3 text-xs font-mono font-bold text-[#C9BADB]/80">
              <span>BEFORE SPONSORFLOW</span>
              <span className="text-[#FF9CC5]">Scattered Workflow</span>
            </div>

            <div className="space-y-3 opacity-75 grayscale hover:grayscale-0 transition-all">
              <WhatsAppCard text="Hey, who has NovaAI's contact number?" time="Unanswered" />
              <EmailCard subject="FWD: FWD: Proposal v3 Final" from="ex-student@vesit.edu" />
              <SpreadsheetCard title="Sponsor_Contacts_2023.xlsx" status="File Corrupted" />
              <ContactCard name="Sponsor Lead: Email Bounced" status="Unverified" />
            </div>
          </div>

          {/* Center Transformation Arrow (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-12 h-12 rounded-full bg-[#4B2B8F] text-[#F8F4FC] flex items-center justify-center font-bold shadow-2xl border-4 border-[#2B1854]">
              <ArrowRight className="w-6 h-6 text-[#D8C9EE]" />
            </div>
          </div>

          {/* Right: SponsorFlow Organized System (Fading In) */}
          <div
            ref={rightOrganizedRef}
            className="bg-[#1A1131]/95 p-8 rounded-3xl border border-[#D8C9EE]/40 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#D8C9EE]/20 pb-3 text-xs font-mono font-bold text-[#D8C9EE]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D8C9EE]" />
                WITH SPONSORFLOW
              </span>
              <span className="px-2 py-0.5 rounded bg-[#6D42C1]/30 text-[#FF9CC5] border border-[#FF6FAE]/30">Single Network</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {organizedModules.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <div key={idx} className="bg-[#251445] p-3.5 rounded-2xl border border-[#B99AE8]/25 space-y-1.5 hover:border-[#B99AE8]/50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-[#6D42C1]/30 text-[#D8C9EE] flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-[#F8F4FC] text-xs">{mod.title}</h4>
                    <p className="text-[10px] text-[#C9BADB] leading-snug">{mod.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Final Conclusion Statement */}
        <div ref={statementRef} className="text-center space-y-3 pt-6">
          <h3 className="text-4xl sm:text-6xl font-display font-black text-[#F8F4FC] tracking-tight">
            "Less chasing. <span className="font-editorial italic font-bold text-[#FF6FAE]">More partnering."</span>
          </h3>
          <p className="text-sm sm:text-base font-sans-ui text-[#D8C9EE] max-w-md mx-auto font-medium">
            This is how college sponsorship discovery is meant to work.
          </p>
        </div>

      </div>
    </section>
  );
}
