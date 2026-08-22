import React, { useState } from "react";
import { Search, Eye, Send, MapPin, Tag } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { brandOpportunitiesForCommittee } from "../../data/mockData";

const filterCategories = ["All", "Monetary", "Products", "Digital / Services", "Hybrid"];
const industryFilters = ["Tech", "Food & Beverage", "Education", "AI", "FinTech", "Local Business"];

export default function DiscoverSponsors() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [approachedBrands, setApproachedBrands] = useState([]);

  const filtered = brandOpportunitiesForCommittee.filter((opp) => {
    if (activeFilter !== "All") {
      const typeMap = {
        "Monetary": "Monetary",
        "Products": "In-Kind",
        "Digital / Services": "Digital",
        "Hybrid": "Hybrid",
      };
      if (opp.contributionType !== typeMap[activeFilter]) return false;
    }
    if (industryFilter && opp.category !== industryFilter) return false;
    if (searchQuery && !opp.brandName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">Discover Sponsors</h2>
          <p className="text-xs text-brown mt-1">Browse sponsorship opportunities posted by brands</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offWhite/50 border border-taupe/30 rounded-lg pl-9 pr-3 py-2 text-xs text-darkBrown placeholder:text-brown/60 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === f
                  ? "bg-espresso text-offWhite shadow-sm"
                  : "bg-white text-darkBrown border border-taupe/30 hover:bg-offWhite"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {industryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setIndustryFilter(industryFilter === f ? null : f)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 ${
                industryFilter === f
                  ? "bg-taupe text-espresso"
                  : "bg-offWhite text-brown border border-taupe/20 hover:bg-taupe/20"
              }`}
            >
              <Tag className="w-3 h-3" />
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <div className="p-5 space-y-4 flex-1">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {opp.brandLogo}
                </div>
                <div>
                  <h3 className="font-bold text-base text-espresso">{opp.brandName}</h3>
                  <p className="text-[10px] text-brown font-semibold uppercase tracking-wider">{opp.tagline}</p>
                </div>
              </div>

              {/* Interested In */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Interested In</p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.interestedIn.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-offWhite rounded text-[10px] text-darkBrown font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can Provide */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Can Provide</p>
                <ul className="space-y-1">
                  {opp.canProvide.map((item, i) => (
                    <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estimated Value */}
              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20">
                <p className="text-[10px] font-bold text-brown uppercase">Estimated Value</p>
                <p className="text-lg font-black text-espresso">{opp.estimatedValue}</p>
              </div>

              {/* Looking For */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Looking For</p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.lookingFor.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-taupe/20 flex gap-2">
              <button
                onClick={() => alert(`Viewing full opportunity from ${opp.brandName}`)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Opportunity
              </button>
              <button
                onClick={() => {
                  setApproachedBrands([...approachedBrands, opp.id]);
                  alert(`Partnership request sent to ${opp.brandName}!`);
                }}
                disabled={approachedBrands.includes(opp.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  approachedBrands.includes(opp.id)
                    ? "bg-taupe/30 text-brown cursor-not-allowed"
                    : "bg-espresso text-offWhite hover:bg-darkBrown"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {approachedBrands.includes(opp.id) ? "Approached" : "Approach Brand"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center">
          <p className="text-sm text-brown">No sponsorship opportunities match your filters.</p>
        </div>
      )}
    </div>
  );
}
