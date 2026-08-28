import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Reusable Topbar component.
 * Accepts currentUser and role-aware tab title resolver.
 * Includes global Light/Dark theme toggle for authenticated users.
 */
export default function Topbar({ onOpenMobileSidebar, activeTab, currentUser, notifications: notifData, getTabTitle, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notifData || []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const defaultGetTabTitle = (tab) => ({
    title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, " "),
    subtitle: "SponsorFlow Portal",
  });

  const { title, subtitle } = (getTabTitle || defaultGetTabTitle)(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side Header Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-sans-ui font-bold text-[var(--text-primary)] tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm font-sans-ui text-[var(--text-secondary)] hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Global Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-subtle)] text-xs font-sans-ui font-bold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-all duration-200 shadow-sm cursor-pointer"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#E65100]" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#B388FF]" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[var(--text-primary)]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-pink)] ring-2 ring-[var(--bg-card)] animate-pulse" />
              )}
            </button>

            {/* Notifications Menu */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans-ui">
                <div className="p-4 bg-[var(--brand-primary)] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-white" />
                    <span className="font-semibold text-sm">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-white/90 hover:text-white transition-colors underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[var(--border-subtle)] max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        n.unread ? "bg-[var(--bg-surface-alt)]" : "hover:bg-[var(--bg-surface-alt)]/50"
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
                        {n.title.includes("Proof") ? (
                          <FileText className="w-4 h-4" />
                        ) : n.title.includes("Request") || n.title.includes("Negotiation") ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-semibold text-[var(--text-primary)] truncate">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)]">{n.time}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[var(--bg-surface-alt)] border-t border-[var(--border-subtle)] text-center">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    SponsorFlow Notification Hub
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Area */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[var(--bg-surface-alt)] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[var(--border-subtle)]">
                {currentUser?.avatar || "SF"}
              </div>
              <div className="hidden lg:block text-left font-sans-ui">
                <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-tight">
                  {currentUser?.role || "Member"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl z-50 overflow-hidden py-1 font-sans-ui">
                <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-alt)]">
                  <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser?.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{currentUser?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
                    {currentUser?.college || currentUser?.company} • {currentUser?.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    alert("Profile clicked (Mock view)");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] font-medium transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    alert("Settings clicked (Mock view)");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] font-medium transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-[var(--border-subtle)] my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--accent-pink)] hover:bg-[var(--accent-pink-bg)] font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[var(--accent-pink)]" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
