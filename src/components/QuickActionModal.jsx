import React, { useState } from "react";
import { X, CheckCircle2, UserPlus, PackagePlus, PlusSquare, FileCheck2, Settings } from "lucide-react";

export default function QuickActionModal({ actionType, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!actionType) return null;

  const getModalInfo = () => {
    switch (actionType) {
      case "add_sponsor":
        return {
          title: "Add New Sponsor",
          icon: UserPlus,
          fields: [
            { label: "Sponsor / Company Name", placeholder: "e.g. Monster Energy", type: "text" },
            { label: "Sponsorship Tier / Package", placeholder: "Select Gold, Silver...", type: "text" },
            { label: "Pledged Amount (₹)", placeholder: "e.g. 50,000", type: "number" },
            { label: "Contact Person Email", placeholder: "contact@company.com", type: "email" },
          ],
        };
      case "create_package":
        return {
          title: "Create Custom Sponsorship Package",
          icon: PackagePlus,
          fields: [
            { label: "Package Name", placeholder: "e.g. Platinum Tier", type: "text" },
            { label: "Price (₹)", placeholder: "e.g. 75,000", type: "number" },
            { label: "Deliverables List", placeholder: "Main stage banner, 5 stories...", type: "text" },
          ],
        };
      case "add_deliverable":
        return {
          title: "Assign New Deliverable",
          icon: PlusSquare,
          fields: [
            { label: "Deliverable Title", placeholder: "e.g. Promotional Standee", type: "text" },
            { label: "Sponsor Name", placeholder: "e.g. Red Bull", type: "text" },
            { label: "Assigned Committee Team", placeholder: "e.g. Design Team", type: "text" },
            { label: "Target Deadline", placeholder: "YYYY-MM-DD", type: "date" },
          ],
        };
      case "view_approvals":
        return {
          title: "Pending Approvals Dashboard",
          icon: FileCheck2,
          isApprovalList: true,
        };
      case "manage_event":
      case "view_event":
        return {
          title: "Manage Event: CSI TechNext 2026",
          icon: Settings,
          fields: [
            { label: "Event Name", placeholder: "CSI TechNext 2026", type: "text" },
            { label: "Target Sponsorship Goal (₹)", placeholder: "4,00,000", type: "number" },
            { label: "Event Venue", placeholder: "VESIT Auditorium", type: "text" },
          ],
        };
      default:
        return {
          title: "Quick Action",
          icon: UserPlus,
          fields: [],
        };
    }
  };

  const info = getModalInfo();
  const IconHeader = info.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-taupe/40">
        {/* Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconHeader className="w-5 h-5 text-taupe" />
            <h3 className="font-bold text-sm sm:text-base tracking-tight">
              {info.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form or View */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-taupe/20 text-espresso mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-espresso" />
              </div>
              <h4 className="font-bold text-lg text-espresso">Action Completed!</h4>
              <p className="text-xs text-brown">
                Mock UI state updated successfully for Experiment 1.
              </p>
            </div>
          ) : info.isApprovalList ? (
            <div className="space-y-3">
              <p className="text-xs text-brown">
                Pending faculty & sponsor approvals requiring committee sign-off:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-offWhite/50 rounded-xl border border-taupe/20 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-espresso">Red Bull MOU Agreement</p>
                    <p className="text-[10px] text-brown">Faculty Advisor Sign-off</p>
                  </div>
                  <button
                    onClick={() => alert("Approved MoU")}
                    className="px-2.5 py-1 bg-taupe text-espresso font-bold rounded-lg hover:bg-espresso hover:text-offWhite transition-colors"
                  >
                    Approve
                  </button>
                </div>

                <div className="p-3 bg-offWhite/50 rounded-xl border border-taupe/20 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-espresso">GitHub Booth Allocation</p>
                    <p className="text-[10px] text-brown">Operations Lead</p>
                  </div>
                  <button
                    onClick={() => alert("Approved Booth")}
                    className="px-2.5 py-1 bg-taupe text-espresso font-bold rounded-lg hover:bg-espresso hover:text-offWhite transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {info.fields?.map((field, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-xs font-bold text-espresso">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-offWhite/40 border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
                  />
                </div>
              ))}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-taupe/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors shadow-sm"
                >
                  Save Action
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
