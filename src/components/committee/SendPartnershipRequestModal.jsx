import React, { useState } from "react";
import { X, Send, Check, Building2, Tag } from "lucide-react";
import { committeeEvents } from "../../data/mockData.js";

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
  const [selectedEventId, setSelectedEventId] = useState(committeeEvents[0]?.id || 1);

  // Prefill requested support based on what brand can provide
  const initialRequesting = (opportunity?.canProvide || []).map((item) =>
    typeof item === "string" ? item : item.item || String(item)
  );

  const [selectedRequesting, setSelectedRequesting] = useState(
    initialRequesting.length > 0 ? initialRequesting : ["₹20,000 Monetary Support", "AI Credits"]
  );

  // Prefill offered benefits based on what brand is looking for
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
    const eventObj = committeeEvents.find((e) => e.id === Number(selectedEventId)) || committeeEvents[0];

    onSubmit({
      event: eventObj,
      requesting: selectedRequesting.length > 0 ? selectedRequesting : ["₹20,000 Monetary Support"],
      offering: selectedOffering.length > 0 ? selectedOffering : ["Stage Branding"],
      message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-taupe/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-espresso p-5 text-offWhite flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
              {opportunity?.brandLogo || "NA"}
            </div>
            <div>
              <h3 className="font-bold text-base text-offWhite">Send Partnership Request</h3>
              <p className="text-xs text-taupe">Approaching {opportunity?.brandName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Brand Banner */}
        <div className="bg-offWhite/60 px-5 py-3 border-b border-taupe/20 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-bold text-espresso">{opportunity?.brandName}</p>
            <p className="text-[10px] text-brown font-medium uppercase tracking-wider">
              {opportunity?.tagline || "Open for College Sponsorships"}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-taupe/20 text-espresso border border-taupe/30">
            {opportunity?.contributionType || "Hybrid"}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Select Event */}
          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-2">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-xs text-darkBrown font-medium focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
            >
              {committeeEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.type} • {evt.participants} Attendees)
                </option>
              ))}
            </select>
          </div>

          {/* What We Are Requesting */}
          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-2">
              What We Are Requesting
            </label>
            <p className="text-[11px] text-brown mb-2">Select the support needed from {opportunity?.brandName}:</p>
            <div className="flex flex-wrap gap-2">
              {supportOptions.map((opt) => {
                const selected = selectedRequesting.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleRequesting(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? "bg-espresso text-offWhite shadow-sm"
                        : "bg-offWhite text-darkBrown border border-taupe/30 hover:bg-taupe/20"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-taupe" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* What We Can Offer */}
          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-2">
              What We Can Offer
            </label>
            <p className="text-[11px] text-brown mb-2">Select benefits your event can provide:</p>
            <div className="flex flex-wrap gap-2">
              {benefitOptions.map((opt) => {
                const selected = selectedOffering.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleOffering(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? "bg-taupe text-espresso shadow-sm"
                        : "bg-offWhite text-brown border border-taupe/30 hover:bg-taupe/20"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-espresso" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-2">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell the sponsor briefly why this event would be a good partnership."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-taupe/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-brown bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-taupe" />
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
