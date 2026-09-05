import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Eye, CheckCircle, RotateCcw, Image as ImageIcon } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";

export default function SponsorDeliverableReview() {
  const partnerships = useSelector((state) => state.partnerships.items);
  const reviews = partnerships.flatMap((p) =>
    (p.deliverables || p.committeeProvides || ["Main Stage Branding"]).map((item, idx) => ({
      id: `${p._id || p.id}_${idx}`,
      collegeName: p.collegeName || p.committeeName || "College Committee",
      eventName: p.eventName || "College Event",
      deliverable: item,
      description: `Deliverable promised for ${p.eventName}`,
      status: p.status === "Approved" ? "Completed" : "Proof Submitted",
      proofUrl: "proof_sample.jpg",
      submittedAt: "Recently",
      updatedAt: "Recently",
    }))
  );

  const [selectedReview, setSelectedReview] = useState(null);

  const handleApproveProof = (id) => {
    setReviews(reviews.map((r) => r.id === id ? { ...r, status: "Completed", updatedAt: "Just now" } : r));
    setSelectedReview(null);
  };

  const handleRequestChanges = (id) => {
    setReviews(reviews.map((r) => r.id === id ? { ...r, status: "Changes Requested", updatedAt: "Just now" } : r));
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Deliverable Review</h2>
        <p className="text-xs text-brown mt-1">Review proof of deliverables submitted by college committees</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-subtle)] text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-[var(--brand-royal)] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No deliverables submitted for review</h3>
          <p className="text-xs text-[var(--text-secondary)]">Submitted deliverable proofs from colleges will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-espresso">{review.deliverable}</h3>
                <p className="text-xs text-brown mt-0.5">
                  {review.eventName} • {review.collegeName}
                </p>
              </div>
              <StatusBadge status={review.status} />
            </div>

            <div className="mt-3 flex items-center gap-3 text-[10px] text-brown">
              <span>Updated: {review.updatedAt}</span>
              {review.proofUrl && (
                <span className="flex items-center gap-1 text-darkBrown font-semibold">
                  <ImageIcon className="w-3 h-3" />
                  {review.proofUrl}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-taupe/15 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedReview(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Details
              </button>

              {review.status === "Proof Submitted" && (
                <>
                  <button
                    onClick={() => handleApproveProof(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve Proof
                  </button>
                  <button
                    onClick={() => handleRequestChanges(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brown bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Request Changes
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Review Detail Modal */}
      <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} title="Deliverable Review" icon={Eye}>
        {selectedReview && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-bold text-espresso">{selectedReview.deliverable}</h4>
                <p className="text-xs text-brown mt-0.5">{selectedReview.eventName} • {selectedReview.collegeName}</p>
              </div>
              <StatusBadge status={selectedReview.status} />
            </div>

            {/* Proof Area */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-espresso uppercase tracking-wider">Proof</span>
              {selectedReview.proofUrl ? (
                <div className="bg-offWhite/60 rounded-xl p-6 border-2 border-dashed border-taupe/40 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-taupe/20 text-brown flex items-center justify-center">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-espresso">{selectedReview.proofUrl}</p>
                  <p className="text-[10px] text-brown">Mock image placeholder</p>
                </div>
              ) : (
                <div className="bg-offWhite/60 rounded-xl p-6 border-2 border-dashed border-taupe/40 text-center">
                  <p className="text-xs text-brown">No proof submitted yet</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
              >
                Close
              </button>
              {selectedReview.status === "Proof Submitted" && (
                <>
                  <button
                    onClick={() => handleRequestChanges(selectedReview.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-brown border border-taupe/30 hover:bg-taupe/20 transition-colors"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => handleApproveProof(selectedReview.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    Approve Proof
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
