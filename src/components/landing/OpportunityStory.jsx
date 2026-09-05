import React, { useEffect, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OpportunityStory({ onNavigateToAuth }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToCards = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const publishedOpportunities = [
    {
      brand: "NovaAI Technologies",
      logo: "NA",
      title: "NovaAI College Hackathon Sponsorship Program",
      description: "Looking to sponsor college hackathons with monetary support, credit vouchers, and mentorship.",
      provides: ["₹20,000 Monetary Support", "100 AI Credit Vouchers", "Winner Perks"],
      lookingFor: ["Website Branding", "Stage Mention", "Product Demo Slot"],
      estValue: "₹50,000",
      featured: true,
    },
    {
      brand: "TechVault",
      logo: "TV",
      title: "TechVault Cloud Hosting Grant for Student Innovators",
      description: "Empowering college tech festivals and hackathons with cloud credits and cash prize support.",
      provides: ["₹50,000 Monetary Support", "Cloud Hosting Credits"],
      lookingFor: ["Main Stage Branding", "Workshop Slot"],
      estValue: "₹75,000",
      featured: false,
    },
    {
      brand: "SnackBox",
      logo: "SB",
      title: "SnackBox Food & Beverage College Event Sponsorship",
      description: "Providing refreshment packs and energy snacks for hackathons, cultural, and sports meets.",
      provides: ["500 Snack Packs", "Volunteer Coffee Vouchers"],
      lookingFor: ["Sponsor Booth", "Social Media Story"],
      estValue: "₹20,000",
      featured: false,
    },
  ];

  return (
    <section
      id="opportunities-section"
      ref={sectionRef}
      className="relative min-h-screen bg-[#12081F] text-[#F8F4FC] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#B99AE8]/20"
    >
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#B99AE8] uppercase tracking-widest px-3 py-1 rounded-full bg-[#251445] border border-[#B99AE8]/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6FAE]" />
            Chapter 07 • Proactive Sponsor Discovery
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#F8F4FC] tracking-tight">
            Stop only searching. <br className="hidden sm:inline" />
            <span className="font-editorial italic font-bold text-[#FF9CC5]">Start discovering.</span>
          </h2>
          <p className="text-sm sm:text-base font-sans-ui text-[#C9BADB] max-w-lg mx-auto font-medium">
            Brands publish their active sponsorship programs directly on Sponnect.
          </p>
        </div>

        {/* Opportunity Notification Cards Stream */}
        <div className="space-y-6 font-sans-ui">
          {publishedOpportunities.map((opp, idx) => (
            <div
              key={idx}
              ref={addToCards}
              className={`bg-[#251445]/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all duration-300 ${
                opp.featured
                  ? "border-[#FF6FAE]/50 shadow-[#FF6FAE]/10"
                  : "border-[#B99AE8]/30 hover:border-[#B99AE8]/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B99AE8]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#12081F] text-[#B99AE8] font-bold flex items-center justify-center border border-[#B99AE8]/30 text-sm">
                    {opp.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#B99AE8] uppercase tracking-wider">NEW OPPORTUNITY</span>
                      {opp.featured && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF6FAE]/20 text-[#FF9CC5] border border-[#FF6FAE]/40">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#F8F4FC]">{opp.brand}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-black text-[#FF9CC5]">{opp.estValue}</span>
                  <button
                    onClick={() => onNavigateToAuth("login")}
                    className="px-4 py-2 rounded-xl bg-[#6D42C1] text-[#F8F4FC] font-bold text-xs hover:bg-[#9859F6] transition-colors flex items-center gap-1 shadow-md"
                  >
                    <span>View Opportunity</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="text-base font-bold text-[#F8F4FC]">{opp.title}</h4>
                <p className="text-xs text-[#C9BADB] font-medium leading-relaxed">{opp.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-[#12081F] p-3 rounded-xl border border-[#B99AE8]/20">
                    <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">Brand Can Provide</p>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.provides.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#6D42C1]/20 rounded text-[10px] text-[#F8F4FC] font-semibold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#12081F] p-3 rounded-xl border border-[#B99AE8]/20">
                    <p className="text-[10px] font-mono font-bold text-[#B99AE8] uppercase mb-1">Brand Expects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.lookingFor.map((l, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#251445] rounded text-[10px] text-[#C9BADB] font-semibold">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="text-center">
          <p className="text-xs font-sans-ui text-[#B99AE8] font-semibold">
            ✦ Committees can approach published brand opportunities with one click.
          </p>
        </div>

      </div>
    </section>
  );
}
