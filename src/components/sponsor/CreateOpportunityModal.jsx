import React, { useState } from "react";
import { X, Megaphone, Plus, Check } from "lucide-react";

const eventTypes = [
  "Hackathons", "Coding Competitions", "Technical Festivals", "Workshops",
  "Cultural Festivals", "Sports Events", "Entrepreneurship Events",
];

const contributionTypes = ["Monetary", "Products", "Digital / Services", "Hybrid"];

const defaultExpectations = [
  "Website Branding", "Banner Branding", "Social Media Promotion", "Stage Acknowledgement",
  "Sponsor Booth", "Product Demonstration", "Workshop Opportunity", "Participant Interaction",
  "Certificate Branding",
];

export default function CreateOpportunityModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [customEventType, setCustomEventType] = useState("");
  const [contributions, setContributions] = useState([{ item: "", type: "Monetary" }]);
  const [estimatedValue, setEstimatedValue] = useState("");
  const [selectedExpectations, setSelectedExpectations] = useState([]);
  const [customExpectation, setCustomExpectation] = useState("");

  const toggleEventType = (type) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addCustomEventType = () => {
    if (customEventType.trim()) {
      setSelectedEventTypes([...selectedEventTypes, customEventType.trim()]);
      setCustomEventType("");
    }
  };

  const toggleExpectation = (exp) => {
    setSelectedExpectations((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const addCustomExpectation = () => {
    if (customExpectation.trim()) {
      setSelectedExpectations([...selectedExpectations, customExpectation.trim()]);
      setCustomExpectation("");
    }
  };

  const addContribution = () => {
    setContributions([...contributions, { item: "", type: "Monetary" }]);
  };

  const updateContribution = (idx, field, value) => {
    setContributions(contributions.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    onSave({
      title: title || "Untitled Sponsorship Opportunity",
      about,
      interestedIn: selectedEventTypes,
      canProvide: contributions.filter((c) => c.item.trim()),
      expectations: selectedExpectations,
      estimatedValue: estimatedValue || "TBD",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-taupe/40 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-taupe" />
            <h3 className="font-bold text-base tracking-tight">Post Sponsorship Opportunity</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Opportunity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NovaAI College Hackathon Sponsorship Program"
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
            />
          </div>

          {/* About */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Short description of your sponsorship program..."
              rows={3}
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe resize-none"
            />
          </div>

          {/* Event Types */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Events We Are Interested In</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedEventTypes.includes(type)
                      ? "bg-espresso text-offWhite"
                      : "bg-offWhite text-darkBrown border border-taupe/30 hover:bg-taupe/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customEventType}
                onChange={(e) => setCustomEventType(e.target.value)}
                placeholder="Add custom event type..."
                className="flex-1 bg-offWhite/50 border border-taupe/30 rounded-lg px-3 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe"
              />
              <button
                onClick={addCustomEventType}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-taupe/20 text-espresso hover:bg-taupe/30 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>

          {/* Contributions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">What We Can Provide</label>
            {contributions.map((c, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={c.item}
                  onChange={(e) => updateContribution(idx, "item", e.target.value)}
                  placeholder="e.g. ₹20,000 Monetary Support"
                  className="flex-1 bg-offWhite/50 border border-taupe/30 rounded-lg px-3 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe"
                />
                <select
                  value={c.type}
                  onChange={(e) => updateContribution(idx, "type", e.target.value)}
                  className="bg-offWhite/50 border border-taupe/30 rounded-lg px-2 py-2 text-xs text-darkBrown focus:outline-none focus:border-taupe"
                >
                  {contributionTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              onClick={addContribution}
              className="text-xs font-bold text-brown hover:text-espresso transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Another Contribution
            </button>
          </div>

          {/* Estimated Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">Estimated Total Value (Optional)</label>
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              placeholder="e.g. ₹50,000"
              className="w-full bg-offWhite/50 border border-taupe/30 rounded-xl px-3 py-2.5 text-sm text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
            />
          </div>

          {/* Expectations */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-espresso uppercase tracking-wider">What We Expect</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultExpectations.map((exp) => (
                <button
                  key={exp}
                  onClick={() => toggleExpectation(exp)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all ${
                    selectedExpectations.includes(exp)
                      ? "bg-espresso text-offWhite"
                      : "bg-offWhite text-darkBrown border border-taupe/20 hover:bg-taupe/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedExpectations.includes(exp) ? "bg-taupe border-taupe" : "border-taupe/40"
                  }`}>
                    {selectedExpectations.includes(exp) && <Check className="w-3 h-3 text-espresso" />}
                  </div>
                  {exp}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customExpectation}
                onChange={(e) => setCustomExpectation(e.target.value)}
                placeholder="Add custom expectation..."
                className="flex-1 bg-offWhite/50 border border-taupe/30 rounded-lg px-3 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe"
              />
              <button
                onClick={addCustomExpectation}
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
            Publish Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
