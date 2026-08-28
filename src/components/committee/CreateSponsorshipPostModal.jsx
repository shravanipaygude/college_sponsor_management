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

  const [monetaryMin, setMonetaryMin] = useState("");
  const [monetaryMax, setMonetaryMax] = useState("");
  const [productsNeeded, setProductsNeeded] = useState("");
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [licenseQuantity, setLicenseQuantity] = useState("");

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
      contributionTypes: selectedTypes,
      monetaryRange: selectedTypes.includes("monetary") ? { min: monetaryMin, max: monetaryMax } : null,
      productsDetails: selectedTypes.includes("inkind") ? { products: productsNeeded, quantity: expectedQuantity } : null,
      serviceDetails: selectedTypes.includes("digital") ? { service: serviceNeeded, licenses: licenseQuantity } : null,
    });
  };

  const showMonetary = selectedTypes.includes("monetary") || selectedTypes.includes("hybrid");
  const showInKind = selectedTypes.includes("inkind") || selectedTypes.includes("hybrid");
  const showDigital = selectedTypes.includes("digital") || selectedTypes.includes("hybrid");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans-ui animate-fadeIn">
      <div className="bg-[var(--bg-card)] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[var(--border-strong)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--brand-primary)] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base tracking-tight text-white">Create Sponsorship Post</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Event Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              {committeeEvents.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Post Title</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Looking for Sponsors — CSI TechNext 2026"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* Event Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Event Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A technical festival featuring hackathons, coding competitions..."
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Contribution Types */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">What Are You Looking For?</label>
            <div className="flex flex-wrap gap-2">
              {contributionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedTypes.includes(type.id)
                      ? "bg-[var(--brand-primary)] text-white shadow-sm"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Contribution-Type Fields */}
          {showMonetary && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                💰 Monetary Sponsorship Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Minimum Amount</label>
                  <input
                    type="text"
                    value={monetaryMin}
                    onChange={(e) => setMonetaryMin(e.target.value)}
                    placeholder="e.g. ₹25,000"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Maximum Amount</label>
                  <input
                    type="text"
                    value={monetaryMax}
                    onChange={(e) => setMonetaryMax(e.target.value)}
                    placeholder="e.g. ₹1,00,000"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {showInKind && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                📦 In-Kind / Products Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Products Needed</label>
                  <input
                    type="text"
                    value={productsNeeded}
                    onChange={(e) => setProductsNeeded(e.target.value)}
                    placeholder="e.g. Snack Packs, T-Shirts"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Expected Quantity</label>
                  <input
                    type="text"
                    value={expectedQuantity}
                    onChange={(e) => setExpectedQuantity(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {showDigital && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                🌐 Digital / Services Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Service / Credits Needed</label>
                  <input
                    type="text"
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    placeholder="e.g. Cloud Credits, API Access"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Quantity / Number of Licenses</label>
                  <input
                    type="text"
                    value={licenseQuantity}
                    onChange={(e) => setLicenseQuantity(e.target.value)}
                    placeholder="e.g. 100 licenses"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Specific Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Specific Requirements</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultRequirements.map((req) => (
                <button
                  key={req}
                  onClick={() => toggleRequirement(req)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    selectedRequirements.includes(req)
                      ? "bg-[var(--brand-primary)] text-white font-bold"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedRequirements.includes(req)
                      ? "bg-white text-[var(--brand-primary)] border-white"
                      : "border-[var(--border-subtle)]"
                  }`}>
                    {selectedRequirements.includes(req) && <Check className="w-3 h-3 text-[var(--brand-primary)]" />}
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
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button
                onClick={addCustomRequirement}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* What We Can Offer */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">What We Can Offer Sponsors</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultBenefits.map((ben) => (
                <button
                  key={ben}
                  onClick={() => toggleBenefit(ben)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    selectedBenefits.includes(ben)
                      ? "bg-[var(--brand-primary)] text-white font-bold"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedBenefits.includes(ben)
                      ? "bg-white text-[var(--brand-primary)] border-white"
                      : "border-[var(--border-subtle)]"
                  }`}>
                    {selectedBenefits.includes(ben) && <Check className="w-3 h-3 text-[var(--brand-primary)]" />}
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
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button
                onClick={addCustomBenefit}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--bg-surface-alt)] border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors shadow-md cursor-pointer"
          >
            Publish Sponsorship Post
          </button>
        </div>
      </div>
    </div>
  );
}
