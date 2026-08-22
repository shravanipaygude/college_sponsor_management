import React from "react";
import { Users, Building2, GraduationCap } from "lucide-react";

/**
 * Temporary role switcher for Experiment 1 UI demonstration.
 * Replace with JWT role-based routing in authentication experiment.
 *
 * Displays a subtle floating button in the bottom-right corner
 * that expands to show role options when clicked.
 */
export default function RoleSwitcher({ currentRole, onRoleChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const roles = [
    { id: "committee", label: "Committee Head", icon: Users, desc: "College committee organizing events" },
    { id: "sponsor", label: "Corporate Sponsor", icon: Building2, desc: "Brand / corporate partner" },
    { id: "faculty", label: "Faculty Approver", icon: GraduationCap, desc: "Faculty reviewing deals" },
  ];

  const currentRoleData = roles.find((r) => r.id === currentRole);

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Expanded Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[59]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-taupe/30 overflow-hidden z-[60]">
            <div className="px-4 py-3 bg-espresso text-offWhite">
              <p className="text-xs font-bold">View As</p>
              <p className="text-[10px] text-taupe mt-0.5">
                Temporary role switcher — Experiment 1 only
              </p>
            </div>
            <div className="p-2 space-y-1">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      onRoleChange(role.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-espresso text-offWhite shadow-sm"
                        : "hover:bg-offWhite text-darkBrown"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-taupe/20 text-taupe" : "bg-taupe/15 text-brown"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isActive ? "text-offWhite" : "text-espresso"}`}>
                        {role.label}
                      </p>
                      <p className={`text-[10px] ${isActive ? "text-taupe" : "text-brown"}`}>
                        {role.desc}
                      </p>
                    </div>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-taupe shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2 bg-offWhite/50 border-t border-taupe/20">
              <p className="text-[9px] text-brown text-center">
                Will be replaced by JWT role-based authentication
              </p>
            </div>
          </div>
        </>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso text-offWhite shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-taupe/30"
      >
        {currentRoleData && <currentRoleData.icon className="w-4 h-4 text-taupe" />}
        <span className="text-xs font-bold">{currentRoleData?.label || "Switch Role"}</span>
      </button>
    </div>
  );
}
