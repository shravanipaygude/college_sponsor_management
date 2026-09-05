import React from "react";
import { X, Image as ImageIcon, Calendar, UserCheck, CheckCircle2, ShieldCheck, Download } from "lucide-react";

export default function DeliverableModal({ deliverable, onClose }) {
  if (!deliverable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-taupe/40 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-taupe" />
            <h3 className="font-bold text-base tracking-tight">Deliverable Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Title & Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-xl font-bold text-espresso leading-snug">
                {deliverable.name}
              </h4>
              <p className="text-xs text-brown font-semibold mt-0.5">
                Sponsor: <span className="text-darkBrown font-bold">{deliverable.sponsor}</span>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-taupe/20 text-espresso border border-taupe/30">
              {deliverable.status}
            </span>
          </div>

          {/* Quick Details Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-offWhite/50 p-3 rounded-xl border border-taupe/20 space-y-0.5">
              <span className="text-[10px] font-bold text-brown uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-taupe" /> Deadline
              </span>
              <p className="font-bold text-espresso">{deliverable.deadline}</p>
            </div>

            <div className="bg-offWhite/50 p-3 rounded-xl border border-taupe/20 space-y-0.5">
              <span className="text-[10px] font-bold text-brown uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-taupe" /> Assigned Team
              </span>
              <p className="font-bold text-espresso">{deliverable.assigned}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-espresso uppercase tracking-wider">
              Description & Specifications
            </span>
            <p className="text-xs text-darkBrown bg-offWhite/30 p-3.5 rounded-xl border border-taupe/20 leading-relaxed">
              {deliverable.description}
            </p>
          </div>

          {/* Mock Proof Area */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-espresso uppercase tracking-wider">
              Proof of Completion
            </span>
            <div className="bg-offWhite/60 rounded-xl p-6 border-2 border-dashed border-taupe/40 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-taupe/20 text-brown flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-espresso">
                  {deliverable.proofUrl}
                </p>
                <p className="text-[10px] text-brown">
                  Submitted proof artifact • Verified by {deliverable.assigned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
          >
            Close
          </button>

          <a
            href={deliverable.proofUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!deliverable.proofUrl || deliverable.proofUrl.includes("#")) {
                e.preventDefault();
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View Proof</span>
          </a>
        </div>
      </div>
    </div>
  );
}
