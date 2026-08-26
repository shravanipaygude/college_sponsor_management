import React from "react";
import {
  FileText,
  Search,
  MessageCircle,
  Handshake,
  CheckCircle2,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Post",
    description: "College posts what it needs. Brand posts what it can provide.",
    icon: FileText,
  },
  {
    number: "2",
    title: "Discover",
    description: "Both sides discover relevant opportunities.",
    icon: Search,
  },
  {
    number: "3",
    title: "Connect",
    description: "Either side can approach the other.",
    icon: MessageCircle,
  },
  {
    number: "4",
    title: "Agree",
    description: "Partnership terms and deliverables are finalized.",
    icon: Handshake,
  },
  {
    number: "5",
    title: "Approve",
    description: "Faculty reviews the sponsorship agreement.",
    icon: CheckCircle2,
  },
  {
    number: "6",
    title: "Deliver",
    description: "Committee completes promised deliverables.",
    icon: CheckSquare,
  },
  {
    number: "7",
    title: "Verify",
    description: "Sponsor reviews proof and partnership completes.",
    icon: ShieldCheck,
  },
];

export default function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            End-to-End Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            From Discovery to Delivery.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            A clear 7-step process engineered for transparency, speed, and institutional accountability.
          </p>
        </div>

        {/* Desktop Connected Horizontal Journey */}
        <div className="hidden lg:block relative py-6">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-taupe/30 -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-7 gap-3 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-4 border border-taupe/30 hover:border-taupe text-center space-y-3 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Step Number Circle */}
                    <div className="w-10 h-10 rounded-full bg-espresso text-offWhite font-black text-sm mx-auto flex items-center justify-center border-2 border-taupe group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-offWhite text-espresso mx-auto flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h3 className="text-base font-bold text-espresso">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-brown font-medium leading-normal">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-4 relative pl-6 border-l-2 border-dashed border-taupe/50 ml-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-offWhite/40 rounded-2xl p-5 border border-taupe/30 relative space-y-2"
              >
                {/* Step badge on timeline */}
                <div className="absolute -left-[35px] top-4 w-7 h-7 rounded-full bg-espresso text-offWhite font-bold text-xs flex items-center justify-center border-2 border-taupe">
                  {step.number}
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-espresso text-taupe flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-espresso">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-brown font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
