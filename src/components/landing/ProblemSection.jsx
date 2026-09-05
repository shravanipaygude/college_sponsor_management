import React from "react";
import { MessageSquareOff, EyeOff, FileSpreadsheet, ArrowRight, ShieldCheck } from "lucide-react";

const problems = [
  {
    title: "Scattered Contacts",
    description:
      "Finding the right brand often depends on personal contacts and endless outreach.",
    icon: MessageSquareOff,
    badge: "Outreach Friction",
  },
  {
    title: "Unclear Opportunities",
    description:
      "Brands don't always know which college events are actively looking for partners.",
    icon: EyeOff,
    badge: "Visibility Gap",
  },
  {
    title: "Messy Coordination",
    description:
      "Offers, commitments, approvals and deliverables get scattered across chats and spreadsheets.",
    icon: FileSpreadsheet,
    badge: "Execution Chaos",
  },
];

export default function ProblemSection() {
  return (
    <section id="why-sponnect" className="py-20 bg-offWhite relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            The Traditional Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            Sponsorship Shouldn't Start With Random DMs.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            College event sponsorship has historically been unstructured, inefficient, and difficult to manage for both sides.
          </p>
        </div>

        {/* 3 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="bg-white rounded-2xl p-7 border border-taupe/30 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-espresso/10 text-espresso flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-offWhite text-[11px] font-bold text-brown border border-taupe/20">
                      {problem.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-espresso">
                    {problem.title}
                  </h3>

                  <p className="text-sm text-brown leading-relaxed font-medium">
                    "{problem.description}"
                  </p>
                </div>

                <div className="pt-4 border-t border-taupe/20 text-xs text-espresso/70 font-semibold flex items-center gap-1">
                  <span>Eliminated by Sponnect</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Banner */}
        <div className="bg-espresso text-offWhite rounded-2xl p-6 sm:p-8 border border-taupe/30 shadow-lg text-center max-w-4xl mx-auto space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-taupe text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Seamless Ecosystem Solution
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-offWhite">
            Sponnect brings the entire process together.
          </h3>
          <p className="text-xs sm:text-sm text-offWhite/80 max-w-xl mx-auto leading-relaxed">
            From discovering potential partners and structuring monetary or non-monetary commitments to securing faculty sign-offs and verifying deliverable proofs — everything lives in one structured workflow.
          </p>
        </div>

      </div>
    </section>
  );
}
