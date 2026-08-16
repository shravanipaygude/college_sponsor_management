import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import EventOverview from "./components/EventOverview";
import StatCard from "./components/StatCard";
import PackageCard from "./components/PackageCard";
import SponsorTable from "./components/SponsorTable";
import DeliverableList from "./components/DeliverableList";
import DeliverableModal from "./components/DeliverableModal";
import AddSponsorshipModal from "./components/AddSponsorshipModal";
import RecentActivity from "./components/RecentActivity";
import QuickActions from "./components/QuickActions";
import QuickActionModal from "./components/QuickActionModal";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [quickActionType, setQuickActionType] = useState(null);
  const [showAddSponsorshipModal, setShowAddSponsorshipModal] = useState(false);

  const handleSelectSponsor = (sponsor) => {
    alert(
      `Sponsorship Deal: ${sponsor.name}\nType: ${sponsor.contributionType}\nContribution: ${sponsor.contribution}\nValuation: ${sponsor.estimatedValue}\nStatus: ${sponsor.status}`
    );
  };

  const handleQuickAction = (actionId) => {
    if (actionId === "add_sponsorship") {
      setShowAddSponsorshipModal(true);
    } else {
      setQuickActionType(actionId);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite text-darkBrown font-sans flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Layout Content Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen transition-all">
        {/* 2. Top Navigation Bar */}
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          activeTab={activeTab}
        />

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Main Committee Head Dashboard View */}
          {activeTab === "dashboard" && (
            <>
              {/* 3. Hero / Event Overview */}
              <EventOverview
                onQuickAction={(action) => handleQuickAction(action)}
              />

              {/* 4. Updated 5 Statistics Cards (Cash & Non-Cash Valuation) */}
              <StatCard />

              {/* 5. Current Sponsors & Deals Table */}
              <SponsorTable onSelectSponsor={handleSelectSponsor} />

              {/* 6. Deliverable Progress & Quick Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                  <DeliverableList
                    onOpenModal={(item) => setSelectedDeliverable(item)}
                  />
                </div>
                <div className="lg:col-span-5 space-y-8">
                  <QuickActions
                    onActionSelect={(actionId) => handleQuickAction(actionId)}
                  />
                  <RecentActivity />
                </div>
              </div>
            </>
          )}

          {/* Dedicated Tab View: Sidebar -> Packages (Partnership Template Management) */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <PackageCard
                onCreatePackage={() => setQuickActionType("create_package")}
              />
            </div>
          )}

          {/* Dedicated Tab View: Sidebar -> Sponsors */}
          {activeTab === "sponsors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-taupe/30">
                <div>
                  <h2 className="text-xl font-bold text-espresso">Sponsor Directory</h2>
                  <p className="text-xs text-brown">Manage confirmed & negotiating sponsors</p>
                </div>
                <button
                  onClick={() => setShowAddSponsorshipModal(true)}
                  className="px-4 py-2 bg-espresso text-offWhite text-xs font-bold rounded-xl"
                >
                  + Add Sponsorship
                </button>
              </div>
              <SponsorTable onSelectSponsor={handleSelectSponsor} />
            </div>
          )}

          {/* Dedicated Tab View: Sidebar -> Deliverables */}
          {activeTab === "deliverables" && (
            <div className="space-y-6">
              <DeliverableList
                onOpenModal={(item) => setSelectedDeliverable(item)}
              />
            </div>
          )}

          {/* Dedicated Tab View: Sidebar -> Approvals */}
          {activeTab === "approvals" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-taupe/20 text-espresso mx-auto flex items-center justify-center font-bold">
                  ✓
                </div>
                <h2 className="text-xl font-bold text-espresso">Approvals Dashboard</h2>
                <p className="text-xs text-brown max-w-md mx-auto">
                  All active sponsorship proposals and deliverables pending faculty or sponsor signatures.
                </p>
                <button
                  onClick={() => setQuickActionType("view_approvals")}
                  className="px-4 py-2 bg-espresso text-offWhite rounded-xl text-xs font-bold"
                >
                  Review 4 Pending Sign-Offs
                </button>
              </div>
            </div>
          )}

          {["events", "invoices", "settings"].includes(activeTab) && (
            <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center space-y-3">
              <h2 className="text-xl font-bold text-espresso capitalize">
                {activeTab} Management
              </h2>
              <p className="text-xs text-brown max-w-md mx-auto">
                This section is configured for SponsorFlow Experiment 1. Navigate back to Dashboard to explore interactive components.
              </p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="px-4 py-2 bg-taupe text-espresso rounded-xl text-xs font-bold hover:bg-espresso hover:text-offWhite transition-colors"
              >
                Return to Main Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Deliverable Detail Modal */}
      {selectedDeliverable && (
        <DeliverableModal
          deliverable={selectedDeliverable}
          onClose={() => setSelectedDeliverable(null)}
        />
      )}

      {/* Add Sponsorship Modal */}
      {showAddSponsorshipModal && (
        <AddSponsorshipModal
          onClose={() => setShowAddSponsorshipModal(false)}
          onSave={(data) => {
            console.log("New Sponsorship Saved:", data);
          }}
        />
      )}

      {/* Quick Action Modal */}
      {quickActionType && (
        <QuickActionModal
          actionType={quickActionType}
          onClose={() => setQuickActionType(null)}
        />
      )}
    </div>
  );
}
