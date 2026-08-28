import React, { useState, useEffect } from "react";
import LandingNavbar from "./LandingNavbar";
import HeroStory from "./HeroStory";
import ChaosStory from "./ChaosStory";
import SponsorFlowReveal from "./SponsorFlowReveal";
import MatchSequenceStory from "./MatchSequenceStory";
import ProductJourneyStory from "./ProductJourneyStory";
import FinalCtaStory from "./FinalCtaStory";
import LandingFooter from "./LandingFooter";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shortened & Polished Public Landing Page for SponsorFlow
 *
 * Real Light / Dark Mode System (persisted in localStorage).
 * Compressed 6-Chapter Storytelling Sequence:
 * 1. HERO + BEGINNING OF CHAOS
 * 2. THE PROBLEM / CHAOS (Messages, contacts, opportunities)
 * 3. SPONSORFLOW REVEAL (Chaos -> Organization)
 * 4. COMMITTEE <-> SPONSOR MATCH (Cards alignment & 92% Match badge)
 * 5. PRODUCT JOURNEY (Concise workflow + integrated history)
 * 6. FINAL TRANSFORMATION + CTA
 */
export default function LandingPage({ onNavigateToAuth }) {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("sponsorflow_landing_theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("sponsorflow_landing_theme", nextTheme);
  };

  // Recalculate ScrollTrigger on theme change to prevent layout jumps
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans-ui selection:bg-[var(--brand-soft)] selection:text-[var(--text-primary)] overflow-x-hidden transition-colors duration-300"
    >
      {/* Fixed Navbar with Theme Toggle */}
      <LandingNavbar
        onNavigateToAuth={onNavigateToAuth}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main 6-Chapter Narrative Story */}
      <main className="relative">
        {/* Chapter 1 — Hero + Beginning of Chaos */}
        <HeroStory onNavigateToAuth={onNavigateToAuth} />

        {/* Chapter 2 — The Problem / Chaos */}
        <ChaosStory />

        {/* Chapter 3 — The SponsorFlow Reveal */}
        <SponsorFlowReveal />

        {/* Chapter 4 — Committee <-> Sponsor Match */}
        <MatchSequenceStory />

        {/* Chapter 5 — Concise Product Journey */}
        <ProductJourneyStory />

        {/* Chapter 6 — Final Transformation + CTA */}
        <FinalCtaStory onNavigateToAuth={onNavigateToAuth} />
      </main>

      {/* Minimal Landing Footer */}
      <LandingFooter onNavigateToAuth={onNavigateToAuth} />
    </div>
  );
}
