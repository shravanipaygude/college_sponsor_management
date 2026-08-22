import React, { useState } from "react";
import { X, FileText, Plus, Check } from "lucide-react";
import { committeeEvents } from "../../data/mockData";

const contributionTypes = [
  { id: "monetary", label: "Monetary" },
  { id: "inkind", label: "In-Kind / Products" },
  { id: "digital", label: "Digital / Services" },
  { id: "hybrid", label: "Hybrid" },
];

const defaultRequirements = [
  "₹50,000–₹1,00,000 monetary sponsorship",
  "AI / Cloud Credits",
  "Food & Beverages",
  "Participant Coupons",
  "Software Licenses",
  "Winner Rewards",
  "Merchandise",
];

const defaultBenefits = [
  "Logo on Event Website",
  "Logo on Main Event Banner",
  "Social Media Stories",
  "Dedicated Social Media Post",
  "Stage Acknowledgement",
  "Sponsor Booth / Stall",
  "Participant Interaction",
  "Certificate Branding",
  "Opening Ceremony Mention",
  "Product Demonstration Opportunity",
  "Workshop / Speaker Slot",
];

export default function CreateSponsorshipPostModal({ onClose, onSave }) {
  const [selectedEvent, setSelectedEvent] = useState(committeeEvents[0]?.id || "");
  const [postTitle, setPostTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [customRequirement, setCustomRequirement] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [customBenefit, setCustomBenefit] = useState("");

  const toggleType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleRequirement = (req) => {
    setSelectedRequirements((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const addCustomRequirement = () => {
    if (customRequirement.trim()) {
      setSelectedRequirements([...selectedRequirements, customRequirement.trim()]);
      setCustomRequirement("");
    }
  };

  const toggleBenefit = (ben) => {
    setSelectedBenefits((prev) =>
      prev.includes(ben) ? prev.filter((b) => b !== ben) : [...prev, ben]
    );
  };

  const addCustomBenefit = () => {
    if (customBenefit.trim()) {
      setSelectedBenefits([...selectedBenefits, customBenefit.trim()]);
      setCustomBenefit("");
    }
  };

  const handleSave = () => {
    const event = committeeEvents.find((e) => e.id === Number(selectedEvent));
    onSave({
      eventId: Number(selectedEvent),
      eventName: event?.name || "Unknown Event",
      title: postTitle || `Looking for Sponsors — ${event?.name}`,
      participants: event?.participants || "N/A",
      eventType: event?.type || "Event",
      eventDate: event?.date || "TBD",
      lookingFor: selectedRequirements,
      canOffer: selectedBenefits,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-taupe/40 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-taupe" />
            <h3 className="font-bold text-base tracking-tight">Create Sponsorship Post</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Event Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
            >
              {committeeEvents.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Post Title</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Looking for Sponsors — CSI TechNext 2026"
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
            />
          </div>

          {/* Event Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Event Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A technical festival featuring hackathons, coding competitions..."
              rows={3}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe resize-none"
            />
          </div>

          {/* Contribution Types */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">What Are You Looking For?</label>
            <div className="flex flex-wrap gap-2">
              {contributionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTypes.includes(type.id)
                      ? "bg-espresso text-offWhite"
                      : "bg-offWhite text-darkBrown border border-taupe/30 hover:bg-taupe/20"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brown uppercase tracking-wider">Specific Requirements</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultRequirements.map((req) => (
                <button
                  key={req}
                  onClick={() => toggleRequirement(req)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all ${
                    selectedRequirements.includes(req)
                      ? "bg-espresso text-offWhite"
                      : "bg-offWhite text-darkBrown border border-taupe/20 hover:bg-taupe/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedRequirements.includes(req)
                      ? "bg-taupe border-taupe"
                      : "border-taupe/40"
                  }`}>
                    {selectedRequirements.includes(req) && <Check className="w-3 h-3 text-espresso" />}
                  </div>
                  {req}
                </button>
              ))}
            </div>
            {/* Custom Requirement */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customRequirement}
                onChange={(e) => setCustomRequirement(e.target.value)}
                placeholder="Add custom requirement..."
                className="flex-1 bg-offWhite/50 border border-taupe/30 rounded-lg px-3 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe"
              />
              <button
                onClick={addCustomRequirement}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-taupe/20 text-espresso hover:bg-taupe/30 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>

          {/* What We Can Offer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">What We Can Offer Sponsors</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultBenefits.map((ben) => (
                <button
                  key={ben}
                  onClick={() => toggleBenefit(ben)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all ${
                    selectedBenefits.includes(ben)
                      ? "bg-espresso text-offWhite"
                      : "bg-offWhite text-darkBrown border border-taupe/20 hover:bg-taupe/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedBenefits.includes(ben)
                      ? "bg-taupe border-taupe"
                      : "border-taupe/40"
                  }`}>
                    {selectedBenefits.includes(ben) && <Check className="w-3 h-3 text-espresso" />}
                  </div>
                  {ben}
                </button>
              ))}
            </div>
            {/* Custom Benefit */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customBenefit}
                onChange={(e) => setCustomBenefit(e.target.value)}
                placeholder="e.g. Exclusive AI Partner Branding"
                className="flex-1 bg-offWhite/50 border border-taupe/30 rounded-lg px-3 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe"
              />
              <button
                onClick={addCustomBenefit}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-taupe/20 text-espresso hover:bg-taupe/30 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors shadow-sm"
          >
            Publish Sponsorship Post
          </button>
        </div>
      </div>
    </div>
  );
}
