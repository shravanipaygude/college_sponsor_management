import React from "react";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function SponsorPartnerships() {
  const partnerships = useSelector((state) => state.partnerships.items);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Partnerships</h2>
        <p className="text-xs text-brown mt-1">Your active partnership discussions with college committees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnerships.map((p) => {
          const offers = p.brandOffers || p.brandProvides || ["Sponsorship Funding"];
          const collegeOffers = p.collegeOffers || p.committeeProvides || p.committeeOffers || ["Event Branding"];

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="bg-espresso p-4 text-offWhite flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                    {p.collegeLogo || "VE"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{p.eventName}</h3>
                    <p className="text-[10px] text-taupe">{p.collegeName || "VESIT"}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Your Offers</p>
                  <ul className="space-y-1">
                    {offers.map((item, i) => (
                      <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">College Offers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {collegeOffers.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                  <span className="text-xs text-brown font-medium">Estimated Value</span>
                  <span className="text-base font-black text-espresso">{p.estimatedValue}</span>
                </div>

                <p className="text-[10px] text-brown">Last updated: {p.lastUpdated || p.createdAt || "Recently"}</p>

                <div className="pt-2 border-t border-taupe/20">
                  <button
                    onClick={() => alert(`Viewing partnership: ${p.eventName}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Partnership
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

