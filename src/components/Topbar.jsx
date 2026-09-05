import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";
import { mockUser } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import Modal from "./common/Modal";
import { markAllNotificationsAsRead, markNotificationAsRead } from "../store/slices/notificationSlice";

export default function Topbar({ onOpenMobileSidebar, activeTab }) {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const currentUser = user || mockUser;

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const allNotifications = useSelector((state) => state.notifications.items);
  // Filter notifications for current user role if specified
  const notifications = allNotifications.filter(
    (n) => !n.role || n.role === currentUser.role
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead(currentUser.role));
  };


  const getTabTitle = (tab) => {
    switch (tab) {
      case "dashboard":
        return { title: "Dashboard", subtitle: "Manage your sponsorship activities" };
      case "events":
        return { title: "Events", subtitle: "College event schedules & venues" };
      case "sponsors":
        return { title: "Sponsors", subtitle: "Active corporate partners & leads" };
      case "packages":
        return { title: "Sponsorship Packages", subtitle: "Tiered sponsorship offerings" };
      case "deliverables":
        return { title: "Deliverable Tracking", subtitle: "Track promised deliverables & proofs" };
      case "approvals":
        return { title: "Approvals", subtitle: "Faculty & sponsor sign-offs" };
      case "invoices":
        return { title: "Invoices & Receipts", subtitle: "Financial records and billing" };
      default:
        return { title: "Dashboard", subtitle: "Manage your sponsorship activities" };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-offWhite/95 backdrop-blur-md border-b border-taupe/20 px-4 sm:px-6 py-4 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side Header Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-lg text-espresso hover:bg-taupe/20 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-espresso tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-brown hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
            <input
              type="text"
              placeholder="Search sponsors, events..."
              className="w-full bg-white/70 border border-taupe/30 rounded-lg pl-9 pr-3 py-1.5 text-xs text-darkBrown placeholder:text-brown/60 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
            />
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-darkBrown hover:bg-taupe/20 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brown ring-2 ring-offWhite animate-pulse" />
              )}
            </button>

            {/* Notifications Menu */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-taupe/30 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-espresso text-offWhite flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-taupe" />
                    <span className="font-semibold text-sm">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-taupe hover:text-offWhite transition-colors underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-taupe/10 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => dispatch(markNotificationAsRead(n.id))}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                        n.unread ? "bg-taupe/10" : "hover:bg-offWhite/50"
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-taupe/20 text-brown">
                        {n.title?.includes("Proof") ? (
                          <FileText className="w-4 h-4" />
                        ) : n.title?.includes("Negotiation") ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-semibold text-darkBrown truncate">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-brown">{n.time}</span>
                        </div>
                        <p className="text-xs text-darkBrown/80 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-xs text-brown">
                      No notifications for {currentUser.role}
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-offWhite/50 border-t border-taupe/20 text-center">
                  <span className="text-xs text-brown font-medium">
                    Sponnect Notification Hub
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
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-taupe/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-espresso text-taupe flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-taupe/30">
                {currentUser.avatar || currentUser.name?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-espresso leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-brown font-medium leading-tight">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-brown" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-taupe/30 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-taupe/15 bg-offWhite/30">
                  <p className="text-xs font-bold text-espresso">{currentUser.name}</p>
                  <p className="text-[11px] text-brown">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-taupe/20 text-darkBrown">
                    {currentUser.college || currentUser.company || "VESIT"} • {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-darkBrown hover:bg-offWhite font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-brown" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-darkBrown hover:bg-offWhite font-medium transition-colors"
                >
                  <Settings className="w-4 h-4 text-brown" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-taupe/15 my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (logout) logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-darkBrown hover:bg-offWhite font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-brown" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile & Settings Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="User Profile & Account"
        icon={User}
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
          <div className="flex items-center gap-3 bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-lg">
              {currentUser?.avatar || currentUser?.name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">{currentUser?.name || "Logged In User"}</h4>
              <p className="text-xs text-[var(--text-secondary)]">{currentUser?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="space-y-2 bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex justify-between">
              <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Organization / College</span>
              <span className="font-semibold">{currentUser?.college || currentUser?.company || "VESIT"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Role Title</span>
              <span className="font-semibold">{currentUser?.role || "Committee Head"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Database Session</span>
              <span className="font-bold text-emerald-500">Connected to MongoDB</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowProfileModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

