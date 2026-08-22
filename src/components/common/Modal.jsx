import React from "react";
import { X } from "lucide-react";

/**
 * Reusable Modal wrapper component.
 * Espresso header, backdrop blur, close button.
 * Used by all role-specific modals.
 */
export default function Modal({ isOpen, onClose, title, icon: Icon, children, maxWidth = "max-w-2xl" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full overflow-hidden shadow-2xl border border-taupe/40 max-h-[90vh] flex flex-col`}>
        {/* Modal Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-taupe" />}
            <h3 className="font-bold text-base tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
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
