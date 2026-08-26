import React, { useState } from "react";
import { Award, ArrowLeft } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * AuthPage — Landing page for SponsorFlow authentication.
 * Displays the SponsorFlow branding and toggles between Login and Register forms.
 * Uses useState to manage which form is currently displayed.
 */
export default function AuthPage({
  initialView = "login",
  initialRole = "",
  onBackToLanding,
}) {
  // useState manages which auth view is active (login or register).
  const [activeView, setActiveView] = useState(initialView);
  const [preselectedRole, setPreselectedRole] = useState(initialRole);

  return (
    <div className="min-h-screen bg-offWhite flex items-center justify-center p-4 sm:p-6 relative">
      {/* Back to Landing Page Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-espresso text-xs font-bold border border-taupe/30 shadow-sm hover:bg-offWhite transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4 text-taupe" />
          <span>Back to SponsorFlow</span>
        </button>
      )}

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-taupe/10" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-brown/10" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-taupe/5" />
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* SponsorFlow Branding Header */}
        <div className="text-center mb-8">
          <div
            onClick={onBackToLanding}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-espresso text-taupe shadow-lg mb-4 border border-taupe/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-espresso tracking-tight">
            SponsorFlow
          </h1>
          <p className="text-sm text-brown mt-2 max-w-xs mx-auto leading-relaxed font-medium">
            College Sponsorship Discovery &amp;
            <br />
            Management Platform
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-taupe/30 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-taupe/20">
            <button
              onClick={() => setActiveView("login")}
              className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${
                activeView === "login"
                  ? "text-espresso border-b-2 border-espresso bg-offWhite/30"
                  : "text-brown hover:text-espresso hover:bg-offWhite/20"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveView("register")}
              className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-200 ${
                activeView === "register"
                  ? "text-espresso border-b-2 border-espresso bg-offWhite/30"
                  : "text-brown hover:text-espresso hover:bg-offWhite/20"
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
        <p className="text-center text-[11px] text-brown/60 mt-6">
          SponsorFlow &copy; {new Date().getFullYear()} — College Sponsorship Portal
        </p>
      </div>
    </div>
  );
}
