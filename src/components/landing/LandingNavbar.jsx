import React, { useState, useEffect } from "react";
import { Award, Menu, X, ArrowRight } from "lucide-react";

export default function LandingNavbar({ onNavigateToAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-espresso/90 backdrop-blur-md border-b border-taupe/20 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-taupe text-espresso flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform duration-200">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-espresso tracking-tight transition-colors">
            <span className={scrolled ? "text-offWhite" : "text-espresso"}>
              Sponsor
            </span>
            <span className="text-taupe">Flow</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className={`transition-colors hover:text-taupe ${
              scrolled ? "text-offWhite/80" : "text-darkBrown"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("for-colleges")}
            className={`transition-colors hover:text-taupe ${
              scrolled ? "text-offWhite/80" : "text-darkBrown"
            }`}
          >
            For Colleges
          </button>
          <button
            onClick={() => scrollToSection("for-sponsors")}
            className={`transition-colors hover:text-taupe ${
              scrolled ? "text-offWhite/80" : "text-darkBrown"
            }`}
          >
            For Sponsors
          </button>
          <button
            onClick={() => scrollToSection("why-sponsorflow")}
            className={`transition-colors hover:text-taupe ${
              scrolled ? "text-offWhite/80" : "text-darkBrown"
            }`}
          >
            Why SponsorFlow
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigateToAuth("login")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              scrolled
                ? "text-offWhite hover:text-taupe"
                : "text-espresso hover:text-darkBrown"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigateToAuth("register")}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 border border-taupe/30"
          >
            Get Started
            <ArrowRight className="w-4 h-4 text-taupe" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${
            scrolled ? "text-offWhite" : "text-espresso"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-espresso text-offWhite border-b border-taupe/20 px-6 py-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-3 font-semibold text-sm">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-left py-2 hover:text-taupe transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("for-colleges")}
              className="text-left py-2 hover:text-taupe transition-colors"
            >
              For Colleges
            </button>
            <button
              onClick={() => scrollToSection("for-sponsors")}
              className="text-left py-2 hover:text-taupe transition-colors"
            >
              For Sponsors
            </button>
            <button
              onClick={() => scrollToSection("why-sponsorflow")}
              className="text-left py-2 hover:text-taupe transition-colors"
            >
              Why SponsorFlow
            </button>
          </div>
          <div className="pt-4 border-t border-taupe/20 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("login");
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-center border border-taupe/30 text-offWhite hover:bg-darkBrown transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("register");
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-taupe text-espresso hover:bg-offWhite transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
