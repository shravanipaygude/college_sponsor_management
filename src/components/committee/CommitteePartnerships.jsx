import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Handshake } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

import { useAuth } from "../../hooks/useAuth";
import { fetchPartnershipsThunk } from "../../store/slices/partnershipSlice";

export default function CommitteePartnerships() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchPartnershipsThunk());
  }, [dispatch]);

  const allPartnerships = useSelector((state) => state.partnerships.items) || [];
  const [selectedPartnershipForView, setSelectedPartnershipForView] = useState(null);

  const rawPartnerships = allPartnerships.filter((p) => {
    if (!user) return false;
    const userHexId = String(user._id || user.id || "");
    const userOrg = (user.organizationName || user.committee || user.name || "").toLowerCase().trim();

    const committeeHex = p.committee ? String(p.committee._id || p.committee) : null;
    if (committeeHex && userHexId && committeeHex === userHexId) {
      return true;
    }
    const commIdStr = p.committeeId ? String(p.committeeId) : null;
    if (commIdStr && userHexId && commIdStr === userHexId) {
      return true;
    }
    const commName = (p.committeeName || "").toLowerCase().trim();
    if (commName && userOrg && commName === userOrg) {
      return true;
    }
    return false;
  });

  const partnerships = Array.from(
    new Map(rawPartnerships.map((p) => [String(p._id || p.id), p])).values()
  );

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Partnerships</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Active partnership agreements and negotiations with sponsors</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnerships.map((p) => (
          <div
            key={p.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-[var(--brand-primary)] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{p.brandName} × {p.eventName}</h3>
                  <p className="text-[10px] text-white/80 font-medium mt-0.5">{p.collegeName || "VESIT"} • {p.committeeName || "CSI"}</p>
                </div>
                <StatusBadge status={p.status || "Active"} />
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Sponsor Provides</p>
                  <p className="font-bold text-[var(--brand-primary)]">
                    {Array.isArray(p.brandProvides) ? p.brandProvides.join(", ") : p.brandProvides || p.brandOffers?.[0] || "Sponsorship"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Committee Promises</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    {Array.isArray(p.committeeOffers) ? p.committeeOffers.join(", ") : p.committeeOffers || "Branding"}
                  </p>
                </div>
                <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-3.5 py-2.5 border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Estimated Value</span>
                  <span className="text-base font-black text-[var(--text-primary)]">{p.estimatedValue || "₹50,000"}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedPartnershipForView(p)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Partnership
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partnerships.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">No active partnerships found.</p>
        </div>
      )}

      {/* View Partnership Modal */}
      <Modal
        isOpen={!!selectedPartnershipForView}
        onClose={() => setSelectedPartnershipForView(null)}
        title="Partnership Agreement Details"
        icon={Handshake}
        maxWidth="max-w-lg"
      >
        {selectedPartnershipForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Sponsor Brand</span>
                <span className="font-semibold">{selectedPartnershipForView.brandName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event Name</span>
                <span className="font-semibold">{selectedPartnershipForView.eventName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Partnership Status</span>
                <StatusBadge status={selectedPartnershipForView.status || "Active"} />
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Support Provided by Sponsor</p>
              <p className="text-xs text-[var(--brand-primary)] font-bold">
                {Array.isArray(selectedPartnershipForView.brandProvides) ? selectedPartnershipForView.brandProvides.join(" + ") : selectedPartnershipForView.brandOffers?.[0] || "₹50,000 Support"}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Deliverables Promised to Sponsor</p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(selectedPartnershipForView.committeeOffers) ? selectedPartnershipForView.committeeOffers : [selectedPartnershipForView.committeeOffers || "Branding"]).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPartnershipForView(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
