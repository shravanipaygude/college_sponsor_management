import React, { useState } from "react";
import { Award, ArrowLeft, Sparkles, Sun, Moon } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useTheme } from "../../context/ThemeContext";

/**
 * AuthPage — Authentication Page for SponsorFlow.
 * Adapts to Light and Dark mode using global ThemeContext and CSS variables.
 */
export default function AuthPage({
  initialView = "login",
  initialRole = "",
  onBackToLanding,
}) {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState(initialView);
  const [preselectedRole, setPreselectedRole] = useState(initialRole);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-4 sm:p-6 relative font-sans-ui transition-colors duration-300">
      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-bold border border-[var(--border-subtle)] shadow-sm hover:bg-[var(--bg-surface-alt)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--brand-royal)]" />
            <span>Back to SponsorFlow</span>
          </button>
        ) : <div />}

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
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--brand-royal)]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[var(--accent-pink)]/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 my-12">
        {/* SponsorFlow Branding Header */}
        <div className="text-center mb-8">
          <div
            onClick={onBackToLanding}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-primary)] text-white shadow-xl mb-4 border border-[var(--border-strong)] cursor-pointer hover:scale-105 transition-transform"
          >
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans-ui font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center gap-1.5">
            <span>Sponsor<span className="text-[var(--brand-royal)]">Flow</span></span>
            <Sparkles className="w-5 h-5 text-[var(--accent-pink)] fill-[var(--accent-pink)]" />
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xs mx-auto leading-relaxed font-medium">
            College Sponsorship Discovery &amp;
            <br />
            Management Platform
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border-strong)] overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <button
              onClick={() => setActiveView("login")}
              className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 cursor-pointer ${
                activeView === "login"
                  ? "text-[var(--text-primary)] border-b-2 border-[var(--brand-primary)] bg-[var(--bg-card)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveView("register")}
              className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 cursor-pointer ${
                activeView === "register"
                  ? "text-[var(--text-primary)] border-b-2 border-[var(--brand-primary)] bg-[var(--bg-card)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {activeView === "login" ? (
              <LoginForm onSwitchToRegister={() => setActiveView("register")} />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setActiveView("login")}
                initialRole={preselectedRole}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-6">
          SponsorFlow &copy; {new Date().getFullYear()} — College Sponsorship Portal
        </p>
      </div>
    </div>
  );
}
