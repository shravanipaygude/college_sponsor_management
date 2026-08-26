import React from "react";
import {
  Gift,
  Sparkles,
  Ticket,
  Laptop,
  Utensils,
  Layers,
  Sparkle,
  Check,
} from "lucide-react";

const sponsorshipTypes = [
  {
    title: "Monetary Support",
    symbol: "₹",
    desc: "Direct financial grants, prize pool funding, and cash sponsorship.",
    badge: "Direct Cash",
  },
  {
    title: "Products & Merchandise",
    icon: Gift,
    desc: "Swag kits, T-shirts, tech gadgets, and winner prize goodies.",
    badge: "Swag & Goods",
  },
  {
    title: "AI & Cloud Credits",
    icon: Sparkles,
    desc: "API access, computing credits, cloud hosting, and sandbox accounts.",
    badge: "Tech Credits",
  },
  {
    title: "Coupons & Vouchers",
    icon: Ticket,
    desc: "Discount codes, course access vouchers, and subscription passes.",
    badge: "Vouchers",
  },
  {
    title: "Software & Subscriptions",
    icon: Laptop,
    desc: "SaaS tools, pro licenses, and developer software access.",
    badge: "Software",
  },
  {
    title: "Food & Beverages",
    icon: Utensils,
    desc: "Snacks, energy drinks, catering, and event food partnerships.",
    badge: "Refreshments",
  },
  {
    title: "Hybrid Sponsorships",
    icon: Layers,
    desc: "Flexible combinations of cash, product credits, and branding.",
    badge: "Flexible Mix",
  },
];

export default function NonCashSection() {
  return (
    <section className="py-20 bg-offWhite/60 relative border-y border-taupe/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            Flexible Partnership Models
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            Sponsorship Is More Than Money.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            SponsorFlow supports both monetary and non-monetary partnerships to maximize event success and sponsor value.
          </p>
        </div>

        {/* Mini-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {sponsorshipTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 border border-taupe/30 hover:border-taupe shadow-sm hover:shadow-md transition-all duration-200 space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                      {Icon ? <Icon className="w-5 h-5" /> : item.symbol}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-offWhite text-[10px] font-bold text-brown border border-taupe/20">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-espresso">
                    {item.title}
                  </h3>

                  <p className="text-xs text-brown font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-espresso/70">
                  <Check className="w-3.5 h-3.5 text-espresso" /> Supported in Deal Builder
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Supporting Quote Line */}
        <div className="bg-white/80 rounded-2xl p-5 border border-taupe/30 max-w-2xl mx-auto text-center shadow-sm">
          <p className="text-xs sm:text-sm font-bold text-espresso italic">
            "₹20,000 + 100 AI credits can be just as valuable as a traditional sponsorship cheque."
          </p>
        </div>

      </div>
    </section>
  );
}
