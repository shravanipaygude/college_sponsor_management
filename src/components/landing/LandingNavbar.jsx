import React, { useState, useEffect } from "react";
import { Award, Menu, X, ArrowRight, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function LandingNavbar({ onNavigateToAuth, theme: propTheme, toggleTheme: propToggleTheme }) {
  const contextTheme = useTheme();
  const theme = propTheme || contextTheme.theme;
  const toggleTheme = propToggleTheme || contextTheme.toggleTheme;

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
          ? "bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform duration-200 border border-[var(--border-strong)]">
            <Award className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-black tracking-tight flex items-center gap-1 text-[var(--text-primary)]">
            <span>Sponsor</span>
            <span className="text-[var(--brand-royal)]">Flow</span>
            <Sparkles className="w-4 h-4 text-[var(--accent-pink)] fill-[var(--accent-pink)]" />
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-sans-ui font-semibold text-[var(--text-secondary)]">
          <button
            onClick={() => scrollToSection("chaos-section")}
            className="transition-colors hover:text-[var(--brand-primary)] cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("match-section")}
            className="transition-colors hover:text-[var(--brand-primary)] cursor-pointer"
          >
            Match System
          </button>
          <button
            onClick={() => scrollToSection("product-section")}
            className="transition-colors hover:text-[var(--brand-primary)] cursor-pointer"
          >
            Platform Workflow
          </button>
        </div>

        {/* Desktop Action Buttons + Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Global Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] text-xs font-sans-ui font-bold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-all duration-200 shadow-sm cursor-pointer"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#E65100]" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#B388FF]" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigateToAuth("login")}
            className="px-4 py-2 rounded-xl text-sm font-sans-ui font-bold text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigateToAuth("register")}
            className="px-5 py-2.5 rounded-xl text-sm font-sans-ui font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-all duration-200 shadow-md flex items-center gap-1.5 border border-[var(--border-strong)] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Mobile Hamburger + Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Sun className="w-4 h-4 text-[#E65100]" /> : <Moon className="w-4 h-4 text-[#B388FF]" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[var(--text-primary)] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-card)] text-[var(--text-primary)] border-b border-[var(--border-subtle)] px-6 py-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-3 font-sans-ui font-semibold text-sm">
            <button
              onClick={() => scrollToSection("chaos-section")}
              className="text-left py-2 hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("match-section")}
              className="text-left py-2 hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
            >
              Match System
            </button>
            <button
              onClick={() => scrollToSection("product-section")}
              className="text-left py-2 hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
            >
              Platform Workflow
            </button>
          </div>
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2.5 font-sans-ui">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("login");
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-center border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth("register");
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
