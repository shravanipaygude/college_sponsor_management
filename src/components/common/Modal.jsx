import React from "react";
import { X } from "lucide-react";

/**
 * Reusable Modal wrapper component.
 * Adapts to global Light & Dark mode using CSS theme variables.
 */
export default function Modal({ isOpen, onClose, title, icon: Icon, children, maxWidth = "max-w-2xl" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans-ui animate-fadeIn">
      <div className={`bg-[var(--bg-card)] rounded-3xl ${maxWidth} w-full overflow-hidden shadow-2xl border border-[var(--border-strong)] max-h-[90vh] flex flex-col`}>
        {/* Modal Header */}
        <div className="bg-[var(--brand-primary)] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className="w-5 h-5 text-white" />}
            <h3 className="font-bold text-base tracking-tight text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
