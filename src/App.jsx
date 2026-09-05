import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard, Search, Calendar, FileText, Inbox,
  Handshake, FileCheck, CheckSquare, Settings, Building2,
  Megaphone, Eye, Clock, History, XCircle, CheckCircle, Bookmark,
} from "lucide-react";

import { fetchEventsThunk, fetchOpportunitiesThunk } from "./store/slices/sponsorshipSlice";
import { fetchRequestsThunk } from "./store/slices/requestSlice";
import { fetchPartnershipsThunk } from "./store/slices/partnershipSlice";

// Auth — Experiment 2
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./components/auth/AuthPage";
import LandingPage from "./components/landing/LandingPage";

// Common Components
import Sidebar from "./components/common/Sidebar";
import Topbar from "./components/common/Topbar";

// Committee Components
import CommitteeDashboard from "./components/committee/CommitteeDashboard";
import DiscoverSponsors from "./components/committee/DiscoverSponsors";
import MyEvents from "./components/committee/MyEvents";
import SponsorshipPosts from "./components/committee/SponsorshipPosts";
import CommitteeIncomingRequests from "./components/committee/CommitteeIncomingRequests";
import CommitteePartnerships from "./components/committee/CommitteePartnerships";
import CommitteeDeals from "./components/committee/CommitteeDeals";
import CommitteeDeliverables from "./components/committee/CommitteeDeliverables";
import SavedSponsors from "./components/committee/SavedSponsors";

// Sponsor Components
import SponsorDashboard from "./components/sponsor/SponsorDashboard";
import DiscoverEvents from "./components/sponsor/DiscoverEvents";
import BrandOpportunities from "./components/sponsor/BrandOpportunities";
import SponsorIncomingRequests from "./components/sponsor/SponsorIncomingRequests";
import SponsorPartnerships from "./components/sponsor/SponsorPartnerships";
import SponsorDeals from "./components/sponsor/SponsorDeals";
import SponsorDeliverableReview from "./components/sponsor/SponsorDeliverableReview";
import SavedEvents from "./components/sponsor/SavedEvents";

// Data
import { notificationsData } from "./data/mockData";

// ─── Role-Specific Navigation Definitions ────────────────────

const committeeNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "My Events", icon: Calendar, id: "my_events" },
  { name: "Discover Sponsors", icon: Search, id: "discover_sponsors" },
  { name: "Incoming Requests", icon: Inbox, id: "incoming_requests" },
  { name: "Partnerships", icon: Handshake, id: "partnerships" },
  { name: "Saved Sponsors", icon: Bookmark, id: "saved_sponsors" },
  { name: "Settings", icon: Settings, id: "settings" },
];

const sponsorNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Our Opportunities", icon: Megaphone, id: "our_opportunities" },
  { name: "Discover Events", icon: Search, id: "discover_events" },
  { name: "Incoming Requests", icon: Inbox, id: "incoming_requests" },
  { name: "Partnerships", icon: Handshake, id: "partnerships" },
  { name: "Saved Events", icon: Bookmark, id: "saved_events" },
  { name: "Settings", icon: Settings, id: "settings" },
];

// ─── Role-Specific Tab Title Resolvers ───────────────────────

const committeeTabTitles = (tab) => {
  const titles = {
    dashboard: { title: "Dashboard", subtitle: "Manage your sponsorship activities" },
    discover_sponsors: { title: "Discover Sponsors", subtitle: "Browse brand sponsorship opportunities" },
    my_events: { title: "My Events", subtitle: "Manage committee events" },
    sponsorship_posts: { title: "Sponsorship Posts", subtitle: "Post requirements to attract sponsors" },
    incoming_requests: { title: "Incoming Requests", subtitle: "Partnership interest from brands" },
    partnerships: { title: "Partnerships", subtitle: "Active negotiations with sponsors" },
    deals: { title: "Sponsorship Deals", subtitle: "Manage finalized agreements" },
    deliverables: { title: "Deliverables", subtitle: "Track promised benefits & proof" },
    saved_sponsors: { title: "Saved Sponsors", subtitle: "Your bookmarked sponsorship opportunities" },
    settings: { title: "Settings", subtitle: "Committee preferences & configuration" },
  };
  return titles[tab] || { title: "Dashboard", subtitle: "Sponnect" };
};

const sponsorTabTitles = (tab) => {
  const titles = {
    dashboard: { title: "Dashboard", subtitle: "Overview of your sponsorship partnerships" },
    discover_events: { title: "Discover Events", subtitle: "Browse college sponsorship posts" },
    our_opportunities: { title: "Our Opportunities", subtitle: "Manage your published sponsorship programs" },
    incoming_requests: { title: "Incoming Requests", subtitle: "Colleges interested in your programs" },
    partnerships: { title: "Partnerships", subtitle: "Active discussions with colleges" },
    deals: { title: "Sponsorship Deals", subtitle: "Your finalized agreements" },
    deliverables: { title: "Deliverable Review", subtitle: "Review proof from college partners" },
    saved_events: { title: "Saved Events", subtitle: "Your bookmarked college events" },
    settings: { title: "Settings", subtitle: "Brand preferences & configuration" },
  };
  return titles[tab] || { title: "Dashboard", subtitle: "Sponnect" };
};

// ─── Role Labels ─────────────────────────────────────────────

const roleLabels = {
  committee: "Committee Head Portal",
  sponsor: "Corporate Sponsor Portal",
};

// ─── App Component ───────────────────────────────────────────

/**
 * Sponnect — College Sponsorship Discovery & Management Portal
 *
 * Experiment 2: Authentication via AuthContext replaces the Experiment 1
 * role switcher. The logged-in user's role determines which interface loads.
 */
export default function App() {
  const dispatch = useDispatch();
  // useAuth is a custom hook for accessing AuthContext.
  const { user, role, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchOpportunitiesThunk());
    dispatch(fetchRequestsThunk());
    dispatch(fetchPartnershipsThunk());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Unauthenticated view state: "landing" | "auth"
  const [authViewMode, setAuthViewMode] = useState("landing");
  const [authInitialView, setAuthInitialView] = useState("login");
  const [authInitialRole, setAuthInitialRole] = useState("");

  const handleNavigateToAuth = (view = "login", role = "") => {
    setAuthInitialView(view);
    setAuthInitialRole(role);
    setAuthViewMode("auth");
  };

  // Show loading screen while session is being restored
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center font-sans-ui">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-lg mx-auto animate-pulse shadow-lg">
            SP
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Loading Sponnect...</p>
        </div>
      </div>
    );
  }

  // Show public landing page or auth page when not authenticated
  if (!isAuthenticated) {
    if (authViewMode === "auth") {
      return (
        <AuthPage
          initialView={authInitialView}
          initialRole={authInitialRole}
          onBackToLanding={() => setAuthViewMode("landing")}
        />
      );
    }
    return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
  }

  // ── Authenticated Dashboard ──────────────────────────────────

  // Safely handle unsupported role (e.g. legacy faculty session)
  if (role === "faculty") {
    logout();
    return null;
  }

  const currentRole = role === "sponsor" ? "sponsor" : "committee";

  // Get role-specific config
  const navItems = currentRole === "sponsor" ? sponsorNavItems : committeeNavItems;
  const getTabTitle = currentRole === "sponsor" ? sponsorTabTitles : committeeTabTitles;

  // Build currentUser object for Topbar from auth context
  const currentUser = {
    name: user?.name || "User",
    role: user?.roleLabel || roleLabels[currentRole] || "Member",
    email: user?.email || "",
    college: user?.college || user?.company || "",
    avatar: user?.avatar || "SF",
    committee: user?.committee || "",
    company: user?.company || "",
    department: user?.department || "",
  };

  const currentNotifications = notificationsData[currentRole] || [];

  // Render role-specific content
  const renderContent = () => {
    // ── Committee Head ──
    if (currentRole === "committee") {
      switch (activeTab) {
        case "dashboard":
          return <CommitteeDashboard onNavigate={setActiveTab} />;
        case "discover_sponsors":
          return <DiscoverSponsors />;
        case "my_events":
          return <MyEvents />;
        case "sponsorship_posts":
          return <SponsorshipPosts />;
        case "incoming_requests":
          return <CommitteeIncomingRequests />;
        case "partnerships":
          return <CommitteePartnerships />;
        case "deals":
          return <CommitteeDeals />;
        case "deliverables":
          return <CommitteeDeliverables />;
        case "saved_sponsors":
          return <SavedSponsors />;
        case "settings":
          return <SettingsPlaceholder role="Committee Head" onBack={() => setActiveTab("dashboard")} />;
        default:
          return <CommitteeDashboard onNavigate={setActiveTab} />;
      }
    }

    // ── Corporate Sponsor ──
    if (currentRole === "sponsor") {
      switch (activeTab) {
        case "dashboard":
          return <SponsorDashboard onNavigate={setActiveTab} />;
        case "discover_events":
          return <DiscoverEvents />;
        case "our_opportunities":
          return <BrandOpportunities />;
        case "incoming_requests":
          return <SponsorIncomingRequests />;
        case "partnerships":
          return <SponsorPartnerships />;
        case "deals":
          return <SponsorDeals />;
        case "deliverables":
          return <SponsorDeliverableReview />;
        case "saved_events":
          return <SavedEvents />;
        case "settings":
          return <SettingsPlaceholder role="Corporate Sponsor" onBack={() => setActiveTab("dashboard")} />;
        default:
          return <SponsorDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans-ui flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        navigationItems={navItems}
        roleLabel={roleLabels[currentRole]}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen transition-all">
        {/* Topbar */}
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          activeTab={activeTab}
          currentUser={currentUser}
          notifications={currentNotifications}
          getTabTitle={getTabTitle}
          onLogout={logout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ─── Settings Placeholder ──────────────────────────────────────

function SettingsPlaceholder({ role, onBack }) {
  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center space-y-3 font-sans-ui shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] mx-auto flex items-center justify-center">
        <Settings className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{role} Settings</h2>
      <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
        Settings configuration for {role}. Manage preferences and account settings here.
      </p>
      <button
        onClick={onBack}
        className="px-4 py-2.5 bg-[var(--brand-primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors shadow-sm cursor-pointer"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
