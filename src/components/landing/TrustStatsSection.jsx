import React, { useState, useEffect, useRef } from "react";
import { Building2, GraduationCap, Users, Megaphone, TrendingUp } from "lucide-react";

const stats = [
  {
    target: 50,
    suffix: "+",
    label: "Companies & Brands",
    desc: "Active corporate sponsors",
    icon: Building2,
  },
  {
    target: 25,
    suffix: "+",
    label: "Colleges Connected",
    desc: "Across multiple departments",
    icon: GraduationCap,
  },
  {
    target: 80,
    suffix: "+",
    label: "Student Committees",
    desc: "Tech, cultural, sports & & business",
    icon: Users,
  },
  {
    target: 120,
    suffix: "+",
    label: "Sponsorship Opportunities",
    desc: "Published programs & requests",
    icon: Megaphone,
  },
];

export default function TrustStatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          const duration = 1500; // ms
          const steps = 30;
          const stepTime = duration / steps;

          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep += 1;
            const progress = currentStep / steps;

            setCounts(
              stats.map((stat) => Math.floor(stat.target * progress))
            );

            if (currentStep >= steps) {
              clearInterval(timer);
              setCounts(stats.map((stat) => stat.target));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-espresso text-offWhite relative overflow-hidden border-y border-taupe/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#A68D77_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-darkBrown border border-taupe/30 text-taupe text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Growing SponsorFlow Network
          </div>
        </div>

        {/* Stats Grid: 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-darkBrown/60 border border-taupe/20 rounded-2xl p-5 sm:p-6 text-center space-y-2 hover:border-taupe/40 transition-all duration-300 shadow-inner group"
              >
                <div className="w-10 h-10 rounded-xl bg-espresso text-taupe mx-auto flex items-center justify-center border border-taupe/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-offWhite tracking-tight">
                  {counts[idx]}
                  <span className="text-taupe">{stat.suffix}</span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-taupe">{stat.label}</p>
                  <p className="text-[11px] text-offWhite/60 font-medium">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
