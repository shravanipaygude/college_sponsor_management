import React, { useEffect, useRef } from "react";
import { History, Award, CheckCircle2, Star, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RelationshipTimeline() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const lineRef = useRef(null);

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

      // Animate line fill
      if (lineRef.current) {
        tl.fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: "none" });
      }

      // Animate items appearing sequentially
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        tl.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<+=0.3"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToItems = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  const timelineEvents = [
    {
      year: "2024",
      role: "Hackathon Partner",
      title: "NovaAI × CSI Student Chapter",
      details: "Provided ₹20,000 + 100 AI Credits for CodeStorm 2024.",
      status: "Completed & Verified",
      badge: "Initial Deal",
    },
    {
      year: "2025",
      role: "Workshop Partner",
      title: "NovaAI × CSI Student Chapter",
      details: "Provided 30 AI Credit Vouchers + Hands-on Lab Facilitation.",
      status: "Completed & Verified",
      badge: "Repeat Sponsorship",
    },
    {
      year: "2026",
      role: "Recommended Sponsor ✦",
      title: "NovaAI Technologies",
      details: "Automatically prioritized for CSI TechNext 2026 based on positive past history.",
      status: "Recommended Partner",
      badge: "Verified Network",
    },
  ];

  return (
    <section
      id="network-section"
      ref={sectionRef}
      className="relative min-h-screen bg-[#F8F5FB] text-[#24133F] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D8C9EE]/30"
    >
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-widest px-3 py-1 rounded-full bg-[#EEE6F8] border border-[#D8C9EE]">
            Chapter 06 • Institutional Memory
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#2B1854] tracking-tight">
            Your network gets more valuable <br className="hidden sm:inline" />
            <span className="font-editorial italic font-bold text-[#6D42C1]">with every event.</span>
          </h2>
          <p className="text-sm sm:text-base font-sans-ui text-[#746286] max-w-lg mx-auto font-medium">
            No more asking who sponsored us last year. Sponnect remembers the relationship.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pt-4 pb-12">
          
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden sm:block absolute left-1/2 top-8 bottom-12 -translate-x-1/2 w-1 bg-[#EEE6F8] rounded-full overflow-hidden">
            <div ref={lineRef} className="w-full h-full bg-[#6D42C1] origin-top" />
          </div>

          {/* Timeline Cards */}
          <div className="space-y-12 sm:space-y-16 font-sans-ui">
            {timelineEvents.map((item, idx) => (
              <div
                key={idx}
                ref={addToItems}
                className={`flex flex-col sm:flex-row items-center gap-6 ${
                  idx % 2 === 0 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Card */}
                <div className="w-full sm:w-1/2 bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D8C9EE]/60 shadow-xl space-y-3 hover:border-[#9B79D6] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#4B2B8F] font-mono">{item.year}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EEE6F8] text-[#6D42C1] border border-[#D8C9EE]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2B1854]">{item.title}</h3>
                  <p className="text-xs font-semibold text-[#6D42C1] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#4B2B8F]" />
                    {item.role}
                  </p>

                  <p className="text-xs text-[#746286] font-medium leading-relaxed">
                    {item.details}
                  </p>

                  <div className="pt-2 border-t border-[#D8C9EE]/30 flex items-center gap-1.5 text-[11px] text-[#4B2B8F] font-semibold">
                    {item.year === "2026" ? (
                      <Star className="w-3.5 h-3.5 text-[#F75C98] fill-[#F75C98]" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6D42C1]" />
                    )}
                    <span>{item.status}</span>
                  </div>
                </div>

                {/* Timeline Node Badge */}
                <div className="w-10 h-10 rounded-full bg-[#4B2B8F] text-[#F8F4FC] font-black text-xs flex items-center justify-center shadow-xl ring-4 ring-[#F8F5FB] shrink-0 z-20 border border-[#D8C9EE]/30">
                  {item.year.slice(2)}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Narrative Closing Line */}
        <div className="text-center bg-[#EEE6F8]/80 p-6 rounded-2xl border border-[#D8C9EE] max-w-xl mx-auto space-y-1 font-sans-ui">
          <p className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-wider">Institutional Continuity</p>
          <p className="text-sm font-semibold text-[#2B1854]">
            Outgoing leaders leave a legacy of organized contacts for the next committee batch.
          </p>
        </div>

      </div>
    </section>
  );
}
