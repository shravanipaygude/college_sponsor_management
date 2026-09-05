import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bookmark, Eye, Heart, Users, Calendar, Tag, Trash2, Check } from "lucide-react";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../common/Modal";
import { createPartnershipRequest, createPartnershipRequestThunk } from "../../store/slices/requestSlice";
import { incrementBrandsInterested } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function SavedEvents() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const posts = useSelector((state) => state.sponsorship.posts);
  const requests = useSelector((state) => state.requests.items);

  const { savedIds, removeItem } = useSavedItems(
    user ? `sf_saved_events_${user.id}` : null
  );

  const savedEvents = posts.filter((post) => savedIds.includes(post.id));
  const [selectedPostForView, setSelectedPostForView] = useState(null);

  const handleExpressInterest = (post) => {
    const brandName = user?.company || user?.name || "NovaAI Technologies";
    const requestPayload = {
      eventId: post._id || post.id,
      eventName: post.eventName || post.title,
      collegeName: post.collegeName || "VESIT",
      collegeLogo: post.collegeLogo || "VE",
      senderId: user?.id || "demo_sponsor_1",
      senderName: brandName,
      senderRole: "sponsor",
      receiverId: post.committeeId || "demo_committee_1",
      receiverName: post.committeeName || "CSI Student Chapter",
      receiverRole: "committee",
      brandName: brandName,
      brandLogo: user?.logo || "NA",
      requesting: Array.isArray(post.lookingFor) ? post.lookingFor : [post.lookingFor || "Sponsorship"],
      theyOffer: Array.isArray(post.canOffer) ? post.canOffer : [post.canOffer || "Branding"],
      offering: Array.isArray(post.canOffer) ? post.canOffer.join(" + ") : post.canOffer || "Branding",
      interestedIn: Array.isArray(post.lookingFor) ? post.lookingFor : [post.lookingFor || "Sponsorship"],
      estimatedValue: "₹50,000",
      message: `${brandName} expressed interest in sponsoring ${post.eventName || post.title}.`,
      status: "Pending",
    };

    dispatch(createPartnershipRequestThunk(requestPayload));
    dispatch(createPartnershipRequest(requestPayload));
    dispatch(incrementBrandsInterested(post.id));

    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Interest Expressed",
        message: `Expressed interest in "${post.eventName || post.title}".`,
      })
    );
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Saved Events</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {savedEvents.length} event{savedEvents.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedEvents.map((post) => {
            const hasExpressed = requests.some(
              (r) => String(r.eventId) === String(post.id) || String(r.eventId) === String(post._id)
            );

            return (
              <div
                key={post.id}
                className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden justify-between"
              >
                {/* Header */}
                <div className="bg-[var(--brand-primary)] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{post.eventName || post.title}</h3>
                      <p className="text-[10px] text-white/80 font-medium">{post.collegeName || "VESIT"} • {post.committeeName || "CSI"}</p>
                    </div>
                    <button
                      onClick={() => removeItem(post.id)}
                      className="p-1.5 rounded-lg text-white/80 hover:text-red-300 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Looking For</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(post.lookingFor || []).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] font-medium text-[var(--text-primary)] border border-[var(--border-subtle)]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex gap-2">
                    <button
                      onClick={() => setSelectedPostForView(post)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleExpressInterest(post)}
                      disabled={hasExpressed}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasExpressed
                          ? "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] cursor-not-allowed border border-[var(--accent-pink)]/40"
                          : "bg-[var(--brand-primary)] text-white hover:opacity-90 shadow-sm"
                      }`}
                    >
                      {hasExpressed ? <Check className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                      {hasExpressed ? "Expressed" : "Express Interest"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] rounded-3xl p-10 border border-[var(--border-subtle)] text-center space-y-3">
          <Bookmark className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No Saved Events</h3>
          <p className="text-xs text-[var(--text-secondary)]">Bookmark events from Discover Events to view them here.</p>
        </div>
      )}

      {/* View Event Modal */}
      <Modal
        isOpen={!!selectedPostForView}
        onClose={() => setSelectedPostForView(null)}
        title={selectedPostForView?.eventName || selectedPostForView?.title || "Event Details"}
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedPostForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">College / Committee</span>
                <span className="font-semibold">{selectedPostForView.collegeName || "VESIT"} ({selectedPostForView.committeeName || "CSI Student Chapter"})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event Date</span>
                <span className="font-semibold">{selectedPostForView.eventDate}</span>
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Description</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedPostForView.description || `${selectedPostForView.eventName} organized by ${selectedPostForView.committeeName || "Committee"}.`}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPostForView(null)}
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
