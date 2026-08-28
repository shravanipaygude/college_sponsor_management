import React from "react";
import {
  Award,
  X,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

/**
 * Reusable Sidebar component.
 * Accepts role-specific navigation items via props.
 * Adapts to Light and Dark mode using global CSS theme variables.
 */
export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, navigationItems, roleLabel, onLogout }) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--bg-card)] text-[var(--text-primary)] border-r border-[var(--border-subtle)] flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 font-sans-ui ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold shadow-md border border-[var(--border-strong)] shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-sans-ui font-bold text-base text-[var(--text-primary)] tracking-tight leading-tight flex items-center gap-1 truncate">
                <span>Sponsor</span>
                <span className="text-[var(--brand-royal)]">Flow</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-pink)] fill-[var(--accent-pink)] shrink-0" />
              </h1>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                {roleLabel || "Sponsorship Portal"}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
            Main Menu
          </div>
          {navigationItems.filter(item => item.id !== "settings").map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (mobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[var(--brand-primary)] text-white font-bold shadow-md"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "text-[var(--brand-royal)]"
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Preferences / Account Section */}
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-1 bg-[var(--bg-surface)]">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "settings"
                ? "bg-[var(--brand-primary)] text-white font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Settings className="w-4 h-4 text-[var(--brand-royal)]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--accent-pink)] hover:bg-[var(--accent-pink-bg)] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[var(--accent-pink)]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
