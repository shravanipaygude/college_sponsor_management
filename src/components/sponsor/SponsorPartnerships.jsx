import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Handshake } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

import { useAuth } from "../../hooks/useAuth";
import { fetchPartnershipsThunk } from "../../store/slices/partnershipSlice";

export default function SponsorPartnerships() {
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
    const userOrg = (user.organizationName || user.company || user.name || "").toLowerCase().trim();

    const sponsorHex = p.sponsor ? String(p.sponsor._id || p.sponsor) : null;
    if (sponsorHex && userHexId && sponsorHex === userHexId) {
      return true;
    }
    const sponIdStr = p.sponsorId ? String(p.sponsorId) : null;
    if (sponIdStr && userHexId && sponIdStr === userHexId) {
      return true;
    }
    const brandNameStr = (p.brandName || p.sponsorName || "").toLowerCase().trim();
    if (brandNameStr && userOrg && brandNameStr === userOrg) {
      return true;
    }
    return false;
  });

  const partnerships = Array.from(
    new Map(rawPartnerships.map((p) => [String(p._id || p.id), p])).values()
  );

  return (
    <div className="space-y-6 font-sans-ui">
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Partnerships</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Your active partnership discussions and agreements with college committees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnerships.map((p) => {
          const offers = p.brandOffers || p.brandProvides || ["Sponsorship Funding"];
          const collegeOffers = p.collegeOffers || p.committeeProvides || p.committeeOffers || ["Event Branding"];

          return (
            <div key={p.id} className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
              <div className="bg-[var(--brand-primary)] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                    {p.collegeLogo || "VE"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.eventName}</h3>
                    <p className="text-[10px] text-white/80 font-medium">{p.collegeName || "VESIT"}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">Your Offers</p>
                    <ul className="space-y-1">
                      {(Array.isArray(offers) ? offers : [offers]).map((item, i) => (
                        <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-1.5">College Offers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(collegeOffers) ? collegeOffers : [collegeOffers]).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--bg-surface-alt)] rounded-2xl px-3.5 py-2.5 border border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)] font-medium">Estimated Value</span>
                    <span className="text-base font-black text-[var(--text-primary)]">{p.estimatedValue || "₹50,000"}</span>
                  </div>
                </div>

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
          );
        })}
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
        title="Partnership Details"
        icon={Handshake}
        maxWidth="max-w-lg"
      >
        {selectedPartnershipForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event</span>
                <span className="font-semibold">{selectedPartnershipForView.eventName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">College / Committee</span>
                <span className="font-semibold">{selectedPartnershipForView.collegeName || "VESIT"} ({selectedPartnershipForView.committeeName || "CSI"})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Partnership Status</span>
                <StatusBadge status={selectedPartnershipForView.status || "Active"} />
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Your Contribution</p>
              <p className="text-xs text-[var(--brand-primary)] font-bold">
                {Array.isArray(selectedPartnershipForView.brandProvides) ? selectedPartnershipForView.brandProvides.join(" + ") : selectedPartnershipForView.brandOffers?.[0] || "₹50,000 Support"}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Promised Deliverables</p>
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
