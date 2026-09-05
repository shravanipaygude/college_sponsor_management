import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Eye, Edit, Send, CheckCircle, FileCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

export default function CommitteeDeals() {
  const partnerships = useSelector((state) => state.partnerships.items);
  const deals = partnerships.map((p) => ({
    id: p._id || p.id,
    brandName: p.brandName || p.sponsorName || "Sponsor",
    brandLogo: p.brandLogo || "NA",
    eventName: p.eventName || "College Event",
    status: p.status || "Active",
    sponsorProvides: Array.isArray(p.sponsorProvides) ? p.sponsorProvides : [{ item: p.supportProvided || "₹50,000 Support", type: "Monetary" }],
    committeeProvides: Array.isArray(p.committeeProvides) ? p.committeeProvides : p.deliverables || ["Main Stage Branding"],
    estimatedTotalValue: p.estimatedTotalValue || p.estimatedValue || "₹50,000",
    facultyStatus: p.facultyApprovalStatus || "pending",
  }));

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedDealForEdit, setSelectedDealForEdit] = useState(null);

  // Edit terms states
  const [editValue, setEditValue] = useState("");
  const [editProvides, setEditProvides] = useState("");

  const openEditTerms = (deal) => {
    setSelectedDealForEdit(deal);
    setEditValue(deal.estimatedTotalValue || "₹50,000");
    setEditProvides(
      deal.committeeProvides ? deal.committeeProvides.join(", ") : ""
    );
  };

  const handleSaveTerms = (e) => {
    e.preventDefault();
    if (!selectedDealForEdit) return;

    setDeals(
      deals.map((d) =>
        d.id === selectedDealForEdit.id
          ? {
              ...d,
              estimatedTotalValue: editValue,
              committeeProvides: editProvides
                ? editProvides.split(",").map((s) => s.trim())
                : d.committeeProvides,
            }
          : d
      )
    );
    setSelectedDealForEdit(null);
  };

  const handleMarkAgreed = (id) => {
    setDeals(deals.map((d) => d.id === id ? { ...d, status: "Deal Agreed", agreedAt: "Just now" } : d));
    setSelectedDeal(null);
  };

  const handleSendForApproval = (id) => {
    setDeals(deals.map((d) => d.id === id ? { ...d, status: "Awaiting Faculty Approval", facultyStatus: "Pending" } : d));
    setSelectedDeal(null);
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Sponsorship Deals</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">View and manage finalized sponsorship agreements</p>
      </div>

      {/* Deals Grid */}
      {deals.length === 0 ? (
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-subtle)] text-center space-y-2">
          <FileCheck className="w-8 h-8 text-[var(--brand-royal)] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No sponsorship deals yet</h3>
          <p className="text-xs text-[var(--text-secondary)]">Deals will appear here when partnership requests are accepted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            <div className="bg-[var(--brand-primary)] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                  {deal.brandLogo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{deal.brandName}</h3>
                  <p className="text-[10px] text-white/80 font-medium">{deal.eventName}</p>
                </div>
              </div>
              <StatusBadge status={deal.status} />
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Sponsor Provides */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">Sponsor Provides</p>
                  <ul className="space-y-1">
                    {deal.sponsorProvides.map((item, i) => (
                      <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                        {item.item}
                        <span className="text-[9px] text-[var(--text-secondary)] bg-[var(--bg-surface-alt)] px-1.5 py-0.5 rounded ml-auto shrink-0 border border-[var(--border-subtle)]">{item.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Committee Provides */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">Committee Provides</p>
                  <div className="flex flex-wrap gap-1.5">
                    {deal.committeeProvides.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-3 py-2 border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Estimated Total Value</span>
                  <span className="text-base font-black text-[var(--text-primary)]">{deal.estimatedTotalValue}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedDeal(deal)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Deal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Deal Detail Modal */}
      <Modal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title="Sponsorship Deal Details"
        icon={FileCheck}
        maxWidth="max-w-lg"
      >
        {selectedDeal && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Brand Name</span>
                <span className="font-semibold">{selectedDeal.brandName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event</span>
                <span className="font-semibold">{selectedDeal.eventName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Status</span>
                <StatusBadge status={selectedDeal.status} />
              </div>
            </div>

            <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-4 py-3 border border-[var(--border-subtle)] text-center">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Total Value</p>
              <p className="text-xl font-black text-[var(--brand-primary)]">{selectedDeal.estimatedTotalValue}</p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Committee Provides</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedDeal.committeeProvides || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Terms Modal */}
      <Modal
        isOpen={!!selectedDealForEdit}
        onClose={() => setSelectedDealForEdit(null)}
        title="Edit Deal Terms"
        icon={Edit}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTerms} className="p-6 space-y-4 font-sans-ui">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Total Value</label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Committee Promises (comma separated)</label>
            <input
              type="text"
              value={editProvides}
              onChange={(e) => setEditProvides(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedDealForEdit(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
            >
              Save Terms
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
