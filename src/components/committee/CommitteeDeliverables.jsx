import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Eye, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

export default function CommitteeDeliverables() {
  const partnerships = useSelector((state) => state.partnerships.items);
  const deliverables = partnerships.flatMap((p) =>
    (p.deliverables || p.committeeProvides || ["Main Stage Branding"]).map((item, idx) => ({
      id: `${p._id || p.id}_${idx}`,
      brandName: p.brandName || p.sponsorName || "Sponsor",
      eventName: p.eventName || "College Event",
      deliverable: item,
      description: `Deliverable agreed for ${p.eventName}`,
      status: p.status === "Approved" ? "Completed" : "In Progress",
      proofUrl: null,
      updatedAt: "Recently",
    }))
  );

  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  // Group deliverables by brand
  const grouped = deliverables.reduce((acc, d) => {
    if (!acc[d.brandName]) acc[d.brandName] = [];
    acc[d.brandName].push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Deliverables</h2>
        <p className="text-xs text-brown mt-1">Track promised benefits and upload proof of completion</p>
      </div>

      {/* Grouped Deliverables */}
      {deliverables.length === 0 ? (
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-subtle)] text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-[var(--brand-royal)] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No deliverables submitted yet</h3>
          <p className="text-xs text-[var(--text-secondary)]">Deliverables will appear here once active partnerships are formed.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([brand, items]) => (
        <div key={brand} className="bg-white rounded-2xl border border-taupe/30 shadow-sm overflow-hidden">
          <div className="bg-espresso px-5 py-3 text-offWhite flex items-center justify-between">
            <h3 className="text-sm font-bold">{brand} × {items[0]?.eventName}</h3>
            <span className="text-[10px] text-taupe">{items.length} deliverables</span>
          </div>

          <div className="divide-y divide-taupe/15">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-offWhite/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-espresso">{item.deliverable}</h4>
                  <p className="text-[10px] text-brown mt-0.5">Updated: {item.updatedAt}</p>
                </div>
                <StatusBadge status={item.status} />
                <button
                  onClick={() => setSelectedDeliverable(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )))}

      {/* Deliverable Detail Modal */}
      <Modal
        isOpen={!!selectedDeliverable}
        onClose={() => setSelectedDeliverable(null)}
        title="Deliverable Details"
        icon={CheckCircle}
      >
        {selectedDeliverable && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-bold text-espresso">{selectedDeliverable.deliverable}</h4>
                <p className="text-xs text-brown font-semibold mt-0.5">
                  Sponsor: <span className="text-darkBrown font-bold">{selectedDeliverable.brandName}</span>
                </p>
              </div>
              <StatusBadge status={selectedDeliverable.status} />
            </div>

            <div className="bg-offWhite/50 p-3.5 rounded-xl border border-taupe/20">
              <p className="text-xs text-darkBrown leading-relaxed">{selectedDeliverable.description}</p>
            </div>

            {/* Proof Area */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                Proof of Completion
              </span>
              {selectedDeliverable.proofUrl ? (
                <div className="bg-offWhite/60 rounded-xl p-6 border-2 border-dashed border-taupe/40 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-taupe/20 text-brown flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-espresso">{selectedDeliverable.proofUrl}</p>
                  <p className="text-[10px] text-brown">Submitted proof artifact</p>
                </div>
              ) : (
                <div className="bg-offWhite/60 rounded-xl p-6 border-2 border-dashed border-taupe/40 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-taupe/20 text-brown flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-brown">No proof uploaded yet</p>
                  <button
                    onClick={() => handleUploadProof(selectedDeliverable.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors cursor-pointer"
                  >
                    Upload Completion Proof
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6">
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
              >
                Close
              </button>
              {!selectedDeliverable.proofUrl && (
                <button
                  onClick={() => handleUploadProof(selectedDeliverable.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Proof
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
