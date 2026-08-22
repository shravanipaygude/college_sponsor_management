import React, { useState } from "react";
import {
  LayoutDashboard, Search, Calendar, FileText, Inbox,
  Handshake, FileCheck, CheckSquare, Settings, Building2,
  Megaphone, Eye, Clock, History, XCircle, CheckCircle, Bookmark,
} from "lucide-react";

// Auth — Experiment 2
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./components/auth/AuthPage";

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
import CommitteeFacultyApprovals from "./components/committee/CommitteeFacultyApprovals";
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

// Faculty Components
import FacultyDashboard from "./components/faculty/FacultyDashboard";
import PendingApprovals from "./components/faculty/PendingApprovals";
import ApprovedDeals from "./components/faculty/ApprovedDeals";
import RejectedDeals from "./components/faculty/RejectedDeals";
import ApprovalHistory from "./components/faculty/ApprovalHistory";

// Data
import { notificationsData } from "./data/mockData";

// ─── Role-Specific Navigation Definitions ────────────────────

const committeeNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Discover Sponsors", icon: Search, id: "discover_sponsors" },
  { name: "My Events", icon: Calendar, id: "my_events" },
  { name: "Sponsorship Posts", icon: FileText, id: "sponsorship_posts" },
  { name: "Incoming Requests", icon: Inbox, id: "incoming_requests" },
  { name: "Partnerships", icon: Handshake, id: "partnerships" },
  { name: "Deals", icon: FileCheck, id: "deals" },
  { name: "Deliverables", icon: CheckSquare, id: "deliverables" },
  { name: "Faculty Approvals", icon: CheckCircle, id: "faculty_approvals" },
  { name: "Saved Sponsors", icon: Bookmark, id: "saved_sponsors" },
  { name: "Settings", icon: Settings, id: "settings" },
];

const sponsorNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Discover Events", icon: Search, id: "discover_events" },
  { name: "Our Opportunities", icon: Megaphone, id: "our_opportunities" },
  { name: "Incoming Requests", icon: Inbox, id: "incoming_requests" },
  { name: "Partnerships", icon: Handshake, id: "partnerships" },
  { name: "Deals", icon: FileCheck, id: "deals" },
  { name: "Deliverables", icon: Eye, id: "deliverables" },
  { name: "Saved Events", icon: Bookmark, id: "saved_events" },
  { name: "Settings", icon: Settings, id: "settings" },
];

const facultyNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Pending Approvals", icon: Clock, id: "pending_approvals" },
  { name: "Approved Deals", icon: CheckCircle, id: "approved_deals" },
  { name: "Rejected Deals", icon: XCircle, id: "rejected_deals" },
  { name: "Approval History", icon: History, id: "approval_history" },
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
    faculty_approvals: { title: "Faculty Approvals", subtitle: "Track approval status of submitted deals" },
    saved_sponsors: { title: "Saved Sponsors", subtitle: "Your bookmarked sponsorship opportunities" },
    settings: { title: "Settings", subtitle: "Committee preferences & configuration" },
  };
  return titles[tab] || { title: "Dashboard", subtitle: "SponsorFlow" };
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
  return titles[tab] || { title: "Dashboard", subtitle: "SponsorFlow" };
};

const facultyTabTitles = (tab) => {
  const titles = {
    dashboard: { title: "Dashboard", subtitle: "Approval overview & pending reviews" },
    pending_approvals: { title: "Pending Approvals", subtitle: "Deals awaiting your review" },
    approved_deals: { title: "Approved Deals", subtitle: "Previously approved sponsorship deals" },
    rejected_deals: { title: "Rejected Deals", subtitle: "Deals sent back for revision" },
    approval_history: { title: "Approval History", subtitle: "Complete record of approval actions" },
    settings: { title: "Settings", subtitle: "Faculty preferences & configuration" },
  };
  return titles[tab] || { title: "Dashboard", subtitle: "SponsorFlow" };
};

// ─── Role Labels ─────────────────────────────────────────────

const roleLabels = {
  committee: "Committee Head Portal",
  sponsor: "Corporate Sponsor Portal",
  faculty: "Faculty Approver Portal",
};

// ─── App Component ───────────────────────────────────────────

/**
 * SponsorFlow — College Sponsorship Discovery & Management Portal
 *
 * Experiment 2: Authentication via AuthContext replaces the Experiment 1
 * role switcher. The logged-in user's role determines which interface loads.
 */
export default function App() {
  // useAuth is a custom hook for accessing AuthContext.
  const { user, role, isAuthenticated, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Show loading screen while session is being restored
  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-espresso text-taupe flex items-center justify-center font-bold text-lg mx-auto animate-pulse">
            SF
          </div>
          <p className="text-sm text-brown font-medium">Loading SponsorFlow...</p>
        </div>
      </div>
    );
  }

  // Show auth page when not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // ── Authenticated Dashboard ──────────────────────────────────

  // Determine role from authenticated user (NOT from manual switcher)
  const currentRole = role || "committee";

  // Get role-specific config
  const navItems = currentRole === "committee" ? committeeNavItems
    : currentRole === "sponsor" ? sponsorNavItems
    : facultyNavItems;

  const getTabTitle = currentRole === "committee" ? committeeTabTitles
    : currentRole === "sponsor" ? sponsorTabTitles
    : facultyTabTitles;

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
        case "faculty_approvals":
          return <CommitteeFacultyApprovals />;
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

    // ── Faculty Approver ──
    if (currentRole === "faculty") {
      switch (activeTab) {
        case "dashboard":
          return <FacultyDashboard onNavigate={setActiveTab} />;
        case "pending_approvals":
          return <PendingApprovals />;
        case "approved_deals":
          return <ApprovedDeals />;
        case "rejected_deals":
          return <RejectedDeals />;
        case "approval_history":
          return <ApprovalHistory />;
        case "settings":
          return <SettingsPlaceholder role="Faculty Approver" onBack={() => setActiveTab("dashboard")} />;
        default:
          return <FacultyDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-offWhite text-darkBrown font-sans flex">
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

      {/* Experiment 1 RoleSwitcher removed — role now determined by login */}
    </div>
  );
}

// ─── Settings Placeholder ──────────────────────────────────────

function SettingsPlaceholder({ role, onBack }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-taupe/20 text-espresso mx-auto flex items-center justify-center">
        <Settings className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-espresso">{role} Settings</h2>
      <p className="text-xs text-brown max-w-md mx-auto">
        Settings configuration for {role}. This section will be expanded in future experiments.
      </p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-taupe text-espresso rounded-xl text-xs font-bold hover:bg-espresso hover:text-offWhite transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
