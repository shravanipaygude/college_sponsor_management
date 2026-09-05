import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  CheckSquare,
  FileCheck,
  Receipt,
  Settings,
  LogOut,
  Award,
  X,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Events", icon: Calendar, id: "events" },
  { name: "Sponsors", icon: Users, id: "sponsors" },
  { name: "Packages", icon: Package, id: "packages" },
  { name: "Deliverables", icon: CheckSquare, id: "deliverables" },
  { name: "Approvals", icon: FileCheck, id: "approvals" },
  { name: "Invoices", icon: Receipt, id: "invoices" },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { logout } = useAuth();
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-espresso text-offWhite flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-6 border-b border-taupe/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-taupe/20 border border-taupe/30 flex items-center justify-center text-taupe shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-offWhite tracking-tight leading-tight">
                Sponnect
              </h1>
              <p className="text-[11px] text-taupe font-medium">
                College Sponsorship Portal
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-taupe uppercase tracking-wider">
            Main Menu
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (mobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-taupe text-espresso font-semibold shadow-sm"
                    : "text-offWhite/80 hover:bg-darkBrown hover:text-offWhite"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-espresso" : "text-taupe"
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-espresso" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Preferences / Account Section */}
        <div className="p-4 border-t border-taupe/20 space-y-1 bg-espresso/80">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-taupe text-espresso font-semibold"
                : "text-offWhite/80 hover:bg-darkBrown hover:text-offWhite"
            }`}
          >
            <Settings className="w-4 h-4 text-taupe" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => logout && logout()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-offWhite/80 hover:bg-darkBrown hover:text-offWhite transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-taupe" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
