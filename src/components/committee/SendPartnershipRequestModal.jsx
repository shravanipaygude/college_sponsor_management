import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Check, X, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const supportOptions = [
  "₹20,000 Monetary Support",
  "AI Credits",
  "Software Licenses",
  "Food / Products",
  "Coupons",
  "Other",
];

const benefitOptions = [
  "Stage Branding",
  "Instagram Promotion",
  "Website Branding",
  "Sponsor Booth",
  "Product Demo",
  "Stage Mention",
  "Participant Interaction",
];

export default function SendPartnershipRequestModal({ opportunity, onClose, onSubmit }) {
  const { user } = useAuth();
  const allEvents = useSelector((state) => state.sponsorship.posts) || [];
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter events belonging to current committee
  const userOrg = (user?.organizationName || user?.committee || "").toLowerCase().trim();
  const userHexId = String(user?._id || user?.id || "");

  const myEvents = allEvents.filter((e) => {
    if (!user) return false;
    const createdByHex = e.createdBy ? String(e.createdBy._id || e.createdBy) : null;
    if (createdByHex && userHexId && createdByHex === userHexId) return true;
    const commName = (e.committeeName || e.committee || "").toLowerCase().trim();
    if (commName && userOrg && commName === userOrg) return true;
    return false;
  });

  const [selectedEventId, setSelectedEventId] = useState(myEvents[0]?.id || myEvents[0]?._id || "");
  const [customEventTitle, setCustomEventTitle] = useState("");

  const initialRequesting = (opportunity?.canProvide || []).map((item) =>
    typeof item === "string" ? item : item.item || String(item)
  );

  const [selectedRequesting, setSelectedRequesting] = useState(
    initialRequesting.length > 0 ? initialRequesting : ["₹20,000 Monetary Support", "AI Credits"]
  );

  const initialOffering = opportunity?.expectations || opportunity?.lookingFor || [];
  const [selectedOffering, setSelectedOffering] = useState(
    initialOffering.length > 0 ? initialOffering : ["Stage Branding", "Instagram Promotion"]
  );

  const [message, setMessage] = useState("");

  const toggleRequesting = (item) => {
    setSelectedRequesting((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleOffering = (item) => {
    setSelectedOffering((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const eventObj = myEvents.find((evt) => String(evt.id || evt._id) === String(selectedEventId)) || {
      eventName: customEventTitle || "College Event",
      title: customEventTitle || "College Event",
    };

    onSubmit({
      event: eventObj,
      requesting: selectedRequesting.length > 0 ? selectedRequesting : ["₹20,000 Monetary Support"],
      offering: selectedOffering.length > 0 ? selectedOffering : ["Stage Branding"],
      message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans-ui">
      <div className="bg-[var(--bg-card)] w-full max-w-xl rounded-3xl border border-[var(--border-strong)] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--brand-primary)] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
              {opportunity?.brandLogo || "NA"}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Send Partnership Request</h3>
              <p className="text-xs text-white/80">Approaching {opportunity?.brandName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Brand Banner */}
        <div className="bg-[var(--bg-surface-alt)] px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-bold text-[var(--text-primary)]">{opportunity?.brandName}</p>
            <p className="text-[10px] font-mono text-[var(--brand-royal)] uppercase tracking-wider">
              {opportunity?.tagline || "Open for College Sponsorships"}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--border-subtle)]">
            {opportunity?.contributionType || "Hybrid"}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Select Event */}
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">
              Select Event
            </label>
            {myEvents.length > 0 ? (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
              >
                {myEvents.map((evt) => (
                  <option key={evt.id || evt._id} value={evt.id || evt._id}>
                    {evt.eventName || evt.title} ({evt.eventType || evt.category || "Event"})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={customEventTitle}
                onChange={(e) => setCustomEventTitle(e.target.value)}
                placeholder="Enter Event Title (e.g. CSI Odyssey 2026)"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
              />
            )}
          </div>

          {/* What We Are Requesting */}
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">
              What We Are Requesting
            </label>
            <p className="text-[11px] text-[var(--text-secondary)] mb-2">Select the support needed from {opportunity?.brandName}:</p>
            <div className="flex flex-wrap gap-2">
              {supportOptions.map((opt) => {
                const selected = selectedRequesting.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleRequesting(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? "bg-[var(--brand-primary)] text-white shadow-sm"
                        : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* What We Can Offer */}
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">
              What We Can Offer
            </label>
            <p className="text-[11px] text-[var(--text-secondary)] mb-2">Select benefits your event can provide:</p>
            <div className="flex flex-wrap gap-2">
              {benefitOptions.map((opt) => {
                const selected = selectedOffering.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleOffering(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? "bg-[var(--brand-primary)] text-white shadow-sm"
                        : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell the sponsor briefly why this event would be a good partnership."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
