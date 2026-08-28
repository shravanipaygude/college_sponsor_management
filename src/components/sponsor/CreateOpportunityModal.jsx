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
  const [selectedContributionType, setSelectedContributionType] = useState("Monetary");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [selectedExpectations, setSelectedExpectations] = useState([]);
  const [customExpectation, setCustomExpectation] = useState("");

  const [monetaryAmount, setMonetaryAmount] = useState("");
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productEstValue, setProductEstValue] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceQuantity, setServiceQuantity] = useState("");
  const [serviceEstValue, setServiceEstValue] = useState("");

  const [hybridContributions, setHybridContributions] = useState([
    { type: "Monetary", item: "", quantity: "", value: "" },
  ]);

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

  const addHybridContribution = () => {
    setHybridContributions([...hybridContributions, { type: "Monetary", item: "", quantity: "", value: "" }]);
  };

  const updateHybridContribution = (idx, field, val) => {
    setHybridContributions(hybridContributions.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const handleSave = () => {
    let canProvide = [];
    if (selectedContributionType === "Monetary") {
      canProvide = [{ item: monetaryAmount ? `₹${monetaryAmount} Monetary Support` : "Monetary Support", type: "Monetary" }];
    } else if (selectedContributionType === "Products") {
      canProvide = [{ item: `${productQuantity ? productQuantity + " " : ""}${productName}`, type: "In-Kind" }];
    } else if (selectedContributionType === "Digital / Services") {
      canProvide = [{ item: `${serviceQuantity ? serviceQuantity + " " : ""}${serviceName}`, type: "Digital" }];
    } else if (selectedContributionType === "Hybrid") {
      canProvide = hybridContributions.filter((c) => c.item.trim()).map((c) => ({
        item: `${c.quantity ? c.quantity + " " : ""}${c.item}`,
        type: c.type,
      }));
    }

    onSave({
      title: title || "Untitled Sponsorship Opportunity",
      about,
      interestedIn: selectedEventTypes,
      canProvide,
      expectations: selectedExpectations,
      estimatedValue: estimatedValue || "TBD",
    });
  };

  const inputClass = "w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans-ui animate-fadeIn">
      <div className="bg-[var(--bg-card)] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[var(--border-strong)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--brand-primary)] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base tracking-tight text-white">Post Sponsorship Opportunity</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Opportunity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NovaAI College Hackathon Sponsorship Program"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* About */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Short description of your sponsorship program..."
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Event Types */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Events We Are Interested In</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedEventTypes.includes(type)
                      ? "bg-[var(--brand-primary)] text-white shadow-sm"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
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
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button
                onClick={addCustomEventType}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Contribution Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">What We Can Provide</label>
            <div className="flex flex-wrap gap-2">
              {contributionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedContributionType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedContributionType === type
                      ? "bg-[var(--brand-primary)] text-white shadow-sm"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Contribution Fields */}
          {selectedContributionType === "Monetary" && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                💰 Monetary Details
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">Amount Available</label>
                <input
                  type="text"
                  value={monetaryAmount}
                  onChange={(e) => setMonetaryAmount(e.target.value)}
                  placeholder="e.g. 20,000"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {selectedContributionType === "Products" && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                📦 Products Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Product</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Snack Packs"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Quantity</label>
                  <input
                    type="text"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    placeholder="e.g. 500"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Estimated Value</label>
                  <input
                    type="text"
                    value={productEstValue}
                    onChange={(e) => setProductEstValue(e.target.value)}
                    placeholder="e.g. ₹20,000"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedContributionType === "Digital / Services" && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                🌐 Digital / Services Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Service / Credits</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. AI Credit Vouchers"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Quantity</label>
                  <input
                    type="text"
                    value={serviceQuantity}
                    onChange={(e) => setServiceQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Estimated Value</label>
                  <input
                    type="text"
                    value={serviceEstValue}
                    onChange={(e) => setServiceEstValue(e.target.value)}
                    placeholder="e.g. ₹30,000"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedContributionType === "Hybrid" && (
            <div className="p-4 bg-[var(--bg-surface-alt)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
              <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                🔄 Hybrid — Combined Contributions
              </p>
              {hybridContributions.map((c, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <select
                    value={c.type}
                    onChange={(e) => updateHybridContribution(idx, "type", e.target.value)}
                    className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-2 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="Monetary">Monetary</option>
                    <option value="Products">Products</option>
                    <option value="Digital">Digital</option>
                    <option value="Services">Services</option>
                  </select>
                  <input
                    type="text"
                    value={c.item}
                    onChange={(e) => updateHybridContribution(idx, "item", e.target.value)}
                    placeholder="Item / Description"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={c.quantity}
                    onChange={(e) => updateHybridContribution(idx, "quantity", e.target.value)}
                    placeholder="Qty"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={c.value}
                    onChange={(e) => updateHybridContribution(idx, "value", e.target.value)}
                    placeholder="Est. Value"
                    className={inputClass}
                  />
                </div>
              ))}
              <button
                onClick={addHybridContribution}
                className="text-xs font-bold text-[var(--brand-royal)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Contribution
              </button>
            </div>
          )}

          {/* Estimated Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Estimated Total Value (Optional)</label>
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              placeholder="e.g. ₹50,000"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* Expectations */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">What We Expect</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultExpectations.map((exp) => (
                <button
                  key={exp}
                  onClick={() => toggleExpectation(exp)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    selectedExpectations.includes(exp)
                      ? "bg-[var(--brand-primary)] text-white font-bold"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedExpectations.includes(exp) ? "bg-white text-[var(--brand-primary)] border-white" : "border-[var(--border-subtle)]"
                  }`}>
                    {selectedExpectations.includes(exp) && <Check className="w-3 h-3 text-[var(--brand-primary)]" />}
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
                className="flex-1 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button
                onClick={addCustomExpectation}
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
            Publish Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
