import React from "react";
import { Award, Sparkles } from "lucide-react";

export default function LandingFooter({ onNavigateToAuth }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[var(--bg-page)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] pt-12 pb-8 font-sans-ui transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-black shadow-md border border-[var(--border-strong)]">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-black text-[var(--text-primary)] tracking-tight flex items-center gap-1">
                Sponsor<span className="text-[var(--brand-royal)]">Flow</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)] fill-[var(--accent-pink)]" />
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              Connecting college events with the right partners through structured discovery, non-cash negotiation, and faculty approvals.
            </p>
          </div>

          {/* Platform Section Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
              <li>
                <button
                  onClick={() => scrollToSection("match-section")}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Match System
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("product-section")}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Platform Workflow
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("chaos-section")}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
              <li>
                <button
                  onClick={() => onNavigateToAuth("login")}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToAuth("register")}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Project
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  About Sponnect
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[11px] text-[var(--text-muted)] font-medium gap-2">
          <p>
            Sponnect — College Sponsorship Discovery &amp; Management Portal
          </p>
          <p>&copy; {new Date().getFullYear()} Sponnect. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
