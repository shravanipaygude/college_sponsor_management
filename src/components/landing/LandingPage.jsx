import React from "react";
import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import TrustStatsSection from "./TrustStatsSection";
import ProblemSection from "./ProblemSection";
import MarketplaceSection from "./MarketplaceSection";
import NonCashSection from "./NonCashSection";
import WorkflowSection from "./WorkflowSection";
import MatchPreviewSection from "./MatchPreviewSection";
import FacultySection from "./FacultySection";
import FeaturesSection from "./FeaturesSection";
import FinalCtaSection from "./FinalCtaSection";
import LandingFooter from "./LandingFooter";

/**
 * Public Landing Page for SponsorFlow
 *
 * Flow:
 * Landing Page -> Get Started / Login -> AuthPage -> Role Dashboards
 */
export default function LandingPage({ onNavigateToAuth }) {
  return (
    <div className="min-h-screen bg-offWhite text-darkBrown font-sans selection:bg-taupe selection:text-espresso">
      {/* 1. Navbar */}
      <LandingNavbar onNavigateToAuth={onNavigateToAuth} />

      <main>
        {/* 2. Hero Section & Creative Visual */}
        <HeroSection onNavigateToAuth={onNavigateToAuth} />

        {/* 3. Platform Numbers / Trust Stats */}
        <TrustStatsSection />

        {/* 4. The Problem Section */}
        <ProblemSection />

        {/* 5. Two-Sided Marketplace Section */}
        <MarketplaceSection onNavigateToAuth={onNavigateToAuth} />

        {/* 6. Non-Cash Sponsorship Section */}
        <NonCashSection />

        {/* 7. How SponsorFlow Works */}
        <WorkflowSection />

        {/* 8. Match Preview Section */}
        <MatchPreviewSection />

        {/* 9. Faculty Approval Section */}
        <FacultySection />

        {/* 10. Platform Features Grid */}
        <FeaturesSection />

        {/* 11. Final CTA */}
        <FinalCtaSection onNavigateToAuth={onNavigateToAuth} />
      </main>

      {/* 12. Footer */}
      <LandingFooter onNavigateToAuth={onNavigateToAuth} />
    </div>
  );
}
