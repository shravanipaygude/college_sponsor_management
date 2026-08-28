import React, { useEffect, useRef } from "react";
import { Building2, Award, Link2, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TwoSidesStory() {
  const sectionRef = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);
  const lineRef = useRef(null);
  const textRevealRef = useRef(null);

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

      // Move left and right sides toward center
      tl.fromTo(leftSideRef.current, { x: -60, opacity: 0.7 }, { x: 0, opacity: 1, duration: 1 });
      tl.fromTo(rightSideRef.current, { x: 60, opacity: 0.7 }, { x: 0, opacity: 1, duration: 1 }, "<");

      // Draw SVG connecting line
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(lineRef.current, { strokeDashoffset: 0, duration: 1 });
      }

      // Reveal matching statements
      tl.fromTo(textRevealRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const committeeNeeds = ["₹ Monetary Funding", "Food & Beverage Partner", "Cloud Hosting Credits", "AI Credit Vouchers", "Event Merchandise"];
  const committeeOffers = ["Stage Branding", "Social Media Promotion", "Sponsor Booth Space", "Product Demonstration", "Student Reach (500+)"];

  const sponsorProvides = ["₹20,000 Support", "100 AI Credit Vouchers", "500 Snack Packs", "Discount Coupons", "Free Software Subscriptions"];
  const sponsorWants = ["Student Reach", "Brand Visibility", "Product Demonstration", "Campus Presence", "Certificate Logos"];

  return (
    <section
      id="two-sides"
      ref={sectionRef}
      className="relative min-h-screen bg-[#F8F5FB] text-[#24133F] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D8C9EE]/30"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-widest px-3 py-1 rounded-full bg-[#EEE6F8] border border-[#D8C9EE]">
            Chapter 03 • Complementary Needs
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#2B1854] tracking-tight">
            Two Sides of the Same Partnership
          </h2>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative font-sans-ui">
          
          {/* Left Side: College Committee */}
          <div
            ref={leftSideRef}
            className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#D8C9EE]/60 shadow-xl space-y-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 border-b border-[#D8C9EE]/30 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEE6F8] text-[#4B2B8F] flex items-center justify-center font-bold border border-[#D8C9EE]">
                <Building2 className="w-5 h-5 text-[#4B2B8F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2B1854]">College Committee</h3>
                <p className="text-xs text-[#746286] font-medium">VESIT • CSI Student Chapter</p>
              </div>
            </div>

            {/* We Need */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-wider">We Need</p>
              <div className="flex flex-wrap gap-2">
                {committeeNeeds.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#EEE6F8] rounded-xl text-xs text-[#2B1854] font-semibold border border-[#D8C9EE]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* We Can Offer */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-wider">We Can Offer</p>
              <div className="flex flex-wrap gap-2">
                {committeeOffers.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#F6F2F8] rounded-xl text-xs text-[#4B2B8F] font-semibold border border-[#D8C9EE]/60">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center Connection Indicator (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#4B2B8F] text-[#F8F4FC] flex items-center justify-center font-bold shadow-xl border-4 border-[#F8F5FB]">
              <Link2 className="w-6 h-6 animate-pulse text-[#D8C9EE]" />
            </div>
          </div>

          {/* Right Side: Corporate Sponsor */}
          <div
            ref={rightSideRef}
            className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#D8C9EE]/60 shadow-xl space-y-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 border-b border-[#D8C9EE]/30 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEE6F8] text-[#4B2B8F] flex items-center justify-center font-bold border border-[#D8C9EE]">
                <Award className="w-5 h-5 text-[#4B2B8F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2B1854]">Corporate Sponsor</h3>
                <p className="text-xs text-[#746286] font-medium">NovaAI Technologies</p>
              </div>
            </div>

            {/* We Can Provide */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-wider">We Can Provide</p>
              <div className="flex flex-wrap gap-2">
                {sponsorProvides.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#EEE6F8] rounded-xl text-xs text-[#4B2B8F] font-semibold border border-[#D8C9EE]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* We're Looking For */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono font-bold text-[#6D42C1] uppercase tracking-wider">We're Looking For</p>
              <div className="flex flex-wrap gap-2">
                {sponsorWants.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#F6F2F8] rounded-xl text-xs text-[#2B1854] font-semibold border border-[#D8C9EE]/60">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SVG Animated Connection Line */}
        <div className="hidden lg:block w-full max-w-md mx-auto h-8">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 20">
            <path
              ref={lineRef}
              d="M 0 10 L 400 10"
              fill="none"
              stroke="#9B79D6"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>
        </div>

        {/* Narrative Match Statement (Editorial Elegance) */}
        <div ref={textRevealRef} className="text-center space-y-2 max-w-xl mx-auto">
          <h4 className="text-2xl sm:text-4xl font-editorial font-bold text-[#2B1854] flex items-center justify-center gap-2">
            <span>There was always a match.</span>
            <Sparkles className="w-6 h-6 text-[#F75C98] fill-[#F75C98]" />
          </h4>
          <p className="text-sm sm:text-base font-editorial italic text-[#746286] font-medium">
            "They just needed a place to find each other."
          </p>
        </div>
      </div>
    </section>
  );
}
