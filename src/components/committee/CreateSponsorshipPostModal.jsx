import React, { useState } from "react";
import { X, FileText, Plus, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const categories = [
  "Technical Festival",
  "Hackathon",
  "Cultural Festival",
  "Workshop",
  "Coding Competition",
  "Exhibition",
  "Seminar",
  "Other",
];

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
  const { user } = useAuth();

  const [postTitle, setPostTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("Technical Festival");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [selectedTypes, setSelectedTypes] = useState(["monetary"]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [customRequirement, setCustomRequirement] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [customBenefit, setCustomBenefit] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!postTitle.trim()) {
      setError("Please enter an Event Title.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter an Event Description.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const currentCommitteeName = user?.organizationName || user?.committee || user?.name || "College Committee";
      const currentUserId = user?._id || user?.id;

      await onSave({
        title: postTitle.trim(),
        eventName: postTitle.trim(),
        description: description.trim(),
        committeeName: currentCommitteeName,
        createdBy: currentUserId,
        collegeName: user?.college || "VESIT",
        collegeLogo: "VE",
        eventType: category,
        category: category,
        eventDate: eventDate || "TBD",
        participants: "500+",
        lookingFor: selectedRequirements,
        canOffer: selectedBenefits,
        contributionTypes: selectedTypes,
        sponsorshipNeeded: selectedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ") || "Monetary",
        coverImage: coverImage.trim(),
        monetaryRange: selectedTypes.includes("monetary") ? { min: monetaryMin, max: monetaryMax } : null,
        productsDetails: selectedTypes.includes("inkind") ? { products: productsNeeded, quantity: expectedQuantity } : null,
        serviceDetails: selectedTypes.includes("digital") ? { service: serviceNeeded, licenses: licenseQuantity } : null,
      });
    } catch (err) {
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMonetary = selectedTypes.includes("monetary") || selectedTypes.includes("hybrid");
  const showInKind = selectedTypes.includes("inkind") || selectedTypes.includes("hybrid");
  const showDigital = selectedTypes.includes("digital") || selectedTypes.includes("hybrid");

  const publishingAs = user?.organizationName || user?.committee || user?.name || "Committee";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans-ui animate-fadeIn">
      <div className="bg-[var(--bg-card)] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[var(--border-strong)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--brand-primary)] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base tracking-tight text-white">Create New Event</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Non-editable Council Identity Badge */}
          <div className="bg-[var(--bg-surface-alt)] px-4 py-2.5 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Creating Event As</span>
            </div>
            <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-3 py-1 rounded-xl border border-[var(--border-subtle)]">
              {publishingAs}
            </span>
          </div>

          {/* Event Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. CSI Odyssey 2026"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-medium"
            />
          </div>

          {/* Category & Event Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                Category / Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* Event Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Event Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event, expected crowd, highlights..."
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Contribution Types */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">
              Sponsorship Needed
            </label>
            <div className="flex flex-wrap gap-2">
              {contributionTypes.map((type) => (
                <button
                  type="button"
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
                  type="button"
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
                type="button"
                onClick={addCustomRequirement}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Benefits Offered */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider">Benefits Offered to Sponsors</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultBenefits.map((ben) => (
                <button
                  type="button"
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
                type="button"
                onClick={addCustomBenefit}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500 font-semibold">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
