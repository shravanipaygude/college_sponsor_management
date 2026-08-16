import React, { useState } from "react";
import {
  X,
  IndianRupee,
  Gift,
  Laptop,
  Layers,
  CheckCircle2,
  Plus,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { packagesData } from "../data/mockData";

const initialDeliverablesList = [
  "Logo on Event Creatives",
  "Logo on Main Banner",
  "Social Media Story",
  "Dedicated Social Media Post",
  "Website Recognition",
  "Stage Acknowledgement",
  "Sponsor Booth",
  "Participant Interaction",
  "Certificate Branding",
  "Opening Ceremony Mention",
];

export default function AddSponsorshipModal({ onClose, onSave }) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Contribution Type: 'monetary' | 'inkind' | 'digital' | 'hybrid'
  const [contributionType, setContributionType] = useState("monetary");

  // Dynamic Fields State
  const [monetaryAmount, setMonetaryAmount] = useState("");
  
  const [inKindItem, setInKindItem] = useState("");
  const [inKindQty, setInKindQty] = useState("");
  const [inKindValue, setInKindValue] = useState("");

  const [digitalItem, setDigitalItem] = useState("");
  const [digitalQty, setDigitalQty] = useState("");
  const [digitalValue, setDigitalValue] = useState("");

  const [hybridCash, setHybridCash] = useState("");
  const [hybridItem, setHybridItem] = useState("");
  const [hybridQty, setHybridQty] = useState("");
  const [hybridAddValue, setHybridAddValue] = useState("");

  // Structure Selection: 'package' | 'custom'
  const [structure, setStructure] = useState("package");
  const [selectedPackage, setSelectedPackage] = useState("event");

  // Promised Benefits Checklist
  const [selectedBenefits, setSelectedBenefits] = useState([
    "Logo on Main Banner",
    "Social Media Story",
    "Website Recognition",
  ]);

  // Custom deliverable input
  const [customDeliverableInput, setCustomDeliverableInput] = useState("");
  const [availableDeliverables, setAvailableDeliverables] = useState(
    initialDeliverablesList
  );

  const [submitted, setSubmitted] = useState(false);

  // Helper for dynamic total estimated calculation in Hybrid
  const calculateTotalHybridValue = () => {
    const cash = parseFloat(hybridCash) || 0;
    const addVal = parseFloat(hybridAddValue) || 0;
    return cash + addVal;
  };

  const toggleBenefit = (benefit) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleAddCustomDeliverable = () => {
    if (!customDeliverableInput.trim()) return;
    const val = customDeliverableInput.trim();
    if (!availableDeliverables.includes(val)) {
      setAvailableDeliverables([...availableDeliverables, val]);
    }
    if (!selectedBenefits.includes(val)) {
      setSelectedBenefits([...selectedBenefits, val]);
    }
    setCustomDeliverableInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onSave) {
        onSave({
          companyName,
          contactPerson,
          contactEmail,
          contributionType,
          structure,
          selectedPackage,
          selectedBenefits,
        });
      }
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-taupe/40">
        {/* Header */}
        <div className="bg-espresso px-6 py-4 text-offWhite flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-taupe" />
            <h3 className="font-bold text-base sm:text-lg tracking-tight">
              Add New Sponsorship Deal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-taupe hover:text-offWhite hover:bg-darkBrown transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-taupe/20 text-espresso mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-espresso" />
              </div>
              <h4 className="font-bold text-xl text-espresso">
                Sponsorship Deal Registered!
              </h4>
              <p className="text-xs text-brown max-w-sm mx-auto">
                The deal has been added to the Committee Head tracking dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Company Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider border-b border-taupe/20 pb-1">
                  1. Company Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-espresso">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Red Bull, GitHub, Monster Energy"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-offWhite/40 border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-espresso">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full bg-offWhite/40 border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-espresso">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="contact@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-offWhite/40 border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown placeholder:text-brown/50 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Contribution Type Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider border-b border-taupe/20 pb-1">
                  2. Contribution Type
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "monetary", label: "Monetary", icon: IndianRupee, desc: "Cash Payment" },
                    { id: "inkind", label: "In-Kind", icon: Gift, desc: "Physical Goods" },
                    { id: "digital", label: "Digital / Service", icon: Laptop, desc: "Credits / Vouchers" },
                    { id: "hybrid", label: "Hybrid", icon: Layers, desc: "Cash + Product" },
                  ].map((type) => {
                    const TypeIcon = type.icon;
                    const isSelected = contributionType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setContributionType(type.id)}
                        className={`p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? "bg-espresso text-offWhite border-espresso ring-2 ring-espresso/30 shadow-md"
                            : "bg-offWhite/40 hover:bg-taupe/15 border-taupe/30 text-darkBrown"
                        }`}
                      >
                        <TypeIcon
                          className={`w-4 h-4 mb-2 ${
                            isSelected ? "text-taupe" : "text-brown"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight">{type.label}</p>
                          <p
                            className={`text-[10px] ${
                              isSelected ? "text-taupe/80" : "text-brown/70"
                            }`}
                          >
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Contribution Fields */}
                <div className="bg-offWhite/60 p-4 rounded-xl border border-taupe/20 space-y-3">
                  {contributionType === "monetary" && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-espresso">
                        Contribution Amount (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50000"
                        value={monetaryAmount}
                        onChange={(e) => setMonetaryAmount(e.target.value)}
                        className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown focus:outline-none focus:border-taupe"
                      />
                    </div>
                  )}

                  {contributionType === "inkind" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          What is the sponsor providing? *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 500 Snack Packets, 200 Energy Drinks"
                          value={inKindItem}
                          onChange={(e) => setInKindItem(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          Quantity
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 500 units"
                          value={inKindQty}
                          onChange={(e) => setInKindQty(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          Estimated Valuation (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 15000"
                          value={inKindValue}
                          onChange={(e) => setInKindValue(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                    </div>
                  )}

                  {contributionType === "digital" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          Service / Digital Benefit *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 100 AI Credit Vouchers, Pro Licenses"
                          value={digitalItem}
                          onChange={(e) => setDigitalItem(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          Quantity / Licenses
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100 codes"
                          value={digitalQty}
                          onChange={(e) => setDigitalQty(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-espresso">
                          Estimated Valuation (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 25000"
                          value={digitalValue}
                          onChange={(e) => setDigitalValue(e.target.value)}
                          className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                        />
                      </div>
                    </div>
                  )}

                  {contributionType === "hybrid" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso">
                            Cash Contribution (₹) *
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 20000"
                            value={hybridCash}
                            onChange={(e) => setHybridCash(e.target.value)}
                            className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso">
                            Additional Product / Service
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 100 Discount Vouchers"
                            value={hybridItem}
                            onChange={(e) => setHybridItem(e.target.value)}
                            className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso">
                            Quantity
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 100 units"
                            value={hybridQty}
                            onChange={(e) => setHybridQty(e.target.value)}
                            className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso">
                            Estimated Additional Value (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 15000"
                            value={hybridAddValue}
                            onChange={(e) => setHybridAddValue(e.target.value)}
                            className="w-full bg-white border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-taupe/20 flex items-center justify-between text-xs">
                        <span className="font-semibold text-brown">
                          Total Estimated Partnership Valuation:
                        </span>
                        <span className="font-extrabold text-espresso text-sm bg-white px-3 py-1 rounded-lg border border-taupe/30">
                          ₹{calculateTotalHybridValue().toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Partnership Structure */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider border-b border-taupe/20 pb-1">
                  3. Partnership Structure
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex items-center gap-3 p-3 rounded-xl border bg-offWhite/30 hover:bg-offWhite cursor-pointer">
                    <input
                      type="radio"
                      name="structure"
                      value="package"
                      checked={structure === "package"}
                      onChange={() => setStructure("package")}
                      className="accent-espresso"
                    />
                    <div>
                      <p className="text-xs font-bold text-espresso">
                        Use Standard Package Template
                      </p>
                      <p className="text-[10px] text-brown">
                        Map to standard tier guidelines
                      </p>
                    </div>
                  </label>

                  <label className="flex-1 flex items-center gap-3 p-3 rounded-xl border bg-offWhite/30 hover:bg-offWhite cursor-pointer">
                    <input
                      type="radio"
                      name="structure"
                      value="custom"
                      checked={structure === "custom"}
                      onChange={() => setStructure("custom")}
                      className="accent-espresso"
                    />
                    <div>
                      <p className="text-xs font-bold text-espresso">
                        Create Custom Partnership
                      </p>
                      <p className="text-[10px] text-brown">
                        Tailored agreement & benefits
                      </p>
                    </div>
                  </label>
                </div>

                {structure === "package" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-espresso">
                      Select Package Template
                    </label>
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="w-full bg-offWhite/40 border border-taupe/30 rounded-xl px-3.5 py-2 text-xs text-darkBrown focus:outline-none focus:border-taupe"
                    >
                      {packagesData.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.price})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 4. Committee Deliverables / Agreed Benefits */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider border-b border-taupe/20 pb-1">
                  4. Promised Benefits & Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {availableDeliverables.map((benefit, idx) => {
                    const isChecked = selectedBenefits.includes(benefit);
                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-taupe/20 text-espresso font-semibold border-taupe/40"
                            : "bg-offWhite/30 text-darkBrown border-taupe/15 hover:bg-offWhite"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBenefit(benefit)}
                          className="accent-espresso rounded"
                        />
                        <span>{benefit}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Add Custom Deliverable Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom promised benefit..."
                    value={customDeliverableInput}
                    onChange={(e) => setCustomDeliverableInput(e.target.value)}
                    className="flex-1 bg-offWhite/40 border border-taupe/30 rounded-xl px-3 py-1.5 text-xs text-darkBrown focus:outline-none focus:border-taupe"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomDeliverable}
                    className="px-3 py-1.5 rounded-xl bg-taupe/20 hover:bg-espresso hover:text-offWhite text-espresso font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-taupe/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors shadow-sm"
                >
                  Confirm Sponsorship
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
