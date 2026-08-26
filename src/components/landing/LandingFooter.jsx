import React from "react";
import { Award } from "lucide-react";

export default function LandingFooter({ onNavigateToAuth }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-darkBrown text-offWhite border-t border-taupe/20 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-taupe text-espresso flex items-center justify-center font-black shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-offWhite tracking-tight">
                Sponsor<span className="text-taupe">Flow</span>
              </span>
            </div>
            <p className="text-xs text-offWhite/70 font-medium leading-relaxed">
              Connecting college events with the right partners through structured discovery, non-cash negotiation, and faculty approvals.
            </p>
          </div>

          {/* Platform Section Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-taupe uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-offWhite/80 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection("for-colleges")}
                  className="hover:text-taupe transition-colors"
                >
                  For Colleges
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("for-sponsors")}
                  className="hover:text-taupe transition-colors"
                >
                  For Sponsors
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="hover:text-taupe transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-taupe uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2 text-xs text-offWhite/80 font-medium">
              <li>
                <button
                  onClick={() => onNavigateToAuth("login")}
                  className="hover:text-taupe transition-colors"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToAuth("register")}
                  className="hover:text-taupe transition-colors"
                >
                  Create Account
                </button>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-taupe uppercase tracking-wider">
              Project
            </h4>
            <ul className="space-y-2 text-xs text-offWhite/80 font-medium">
              <li>
                <button
                  onClick={() => scrollToSection("why-sponsorflow")}
                  className="hover:text-taupe transition-colors"
                >
                  About SponsorFlow
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-taupe/20 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[11px] text-offWhite/60 font-medium gap-2">
          <p>
            SponsorFlow — College Sponsorship Discovery &amp; Management Portal
          </p>
          <p>&copy; {new Date().getFullYear()} SponsorFlow. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
