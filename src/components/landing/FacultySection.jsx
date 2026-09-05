import React from "react";
import { GraduationCap, Users, Building2, Handshake, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function FacultySection() {
  const steps = [
    {
      title: "Committee + Brand",
      desc: "Connect & discuss event scope",
      icon: Users,
    },
    {
      title: "Deal Agreed",
      desc: "Finalize financial & deliverable terms",
      icon: Handshake,
    },
    {
      title: "Faculty Review",
      desc: "Department oversight & policy check",
      icon: GraduationCap,
    },
    {
      title: "Approved Partnership",
      desc: "Official active sponsorship",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3.5 py-1 rounded-full bg-espresso/10 text-espresso text-xs font-bold uppercase tracking-wider">
            Institutional Compliance &amp; Governance
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-espresso tracking-tight">
            Partnerships With Proper Oversight.
          </h2>
          <p className="text-base sm:text-lg text-brown font-medium">
            Sponnect ensures that finalized sponsorship agreements are submitted for Faculty Approver review before becoming active.
          </p>
        </div>

        {/* Visual Mini-Flow Container */}
        <div className="bg-espresso text-offWhite rounded-3xl p-8 sm:p-10 border border-taupe/30 shadow-xl max-w-5xl mx-auto space-y-8 relative overflow-hidden">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              return (
                <div key={step.title} className="relative">
                  <div className="bg-darkBrown/80 rounded-2xl p-5 border border-taupe/20 h-full space-y-3 flex flex-col justify-between hover:border-taupe/40 transition-colors">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold border border-taupe/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-offWhite">
                        {step.title}
                      </h3>
                      <p className="text-xs text-offWhite/70 font-medium">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-2 text-[10px] font-bold text-taupe uppercase tracking-wider">
                      Step 0{idx + 1}
                    </div>
                  </div>

                  {!isLast && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-taupe">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Key Takeaway Line */}
          <div className="pt-4 border-t border-taupe/20 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-taupe text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Clear terms. Better accountability. Fewer misunderstandings.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
