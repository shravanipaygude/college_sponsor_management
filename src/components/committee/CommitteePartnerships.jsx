import React from "react";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function CommitteePartnerships() {
  const partnerships = useSelector((state) => state.partnerships.items);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Partnerships</h2>
        <p className="text-xs text-brown mt-1">Active partnership discussions and negotiations with sponsors</p>
      </div>

      {/* Partnership Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnerships.map((p) => (

          <div
            key={p.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Partnership Header */}
            <div className="bg-espresso p-4 text-offWhite flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {p.brandLogo}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{p.brandName} × {p.eventName}</h3>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            {/* Partnership Body */}
            <div className="p-5 space-y-4">
              {/* Brand Offers */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">{p.brandName} Offers</p>
                <ul className="space-y-1">
                  {p.brandOffers.map((item, i) => (
                    <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Committee Offers */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Committee Offers</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.committeeOffers.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estimated Value */}
              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                <span className="text-xs text-brown font-medium">Estimated Value</span>
                <span className="text-base font-black text-espresso">{p.estimatedValue}</span>
              </div>

              <p className="text-[10px] text-brown">Last updated: {p.lastUpdated}</p>

              {/* Action */}
              <div className="pt-2 border-t border-taupe/20">
                <button
                  onClick={() => alert(`Viewing partnership: ${p.brandName} × ${p.eventName}`)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Partnership
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
