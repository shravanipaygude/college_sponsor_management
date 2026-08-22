import React from "react";
import { CheckCircle, Eye } from "lucide-react";
import { approvedDeals } from "../../data/mockData";

export default function ApprovedDeals() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Approved Deals</h2>
        <p className="text-xs text-brown mt-1">Sponsorship deals that have been approved</p>
      </div>

      <div className="space-y-4">
        {approvedDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {deal.brandLogo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-espresso">{deal.brandName}</h3>
                  <p className="text-xs text-brown">{deal.eventName} • {deal.committeeName}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-taupe/30 text-espresso border border-taupe/50">
                Approved
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Sponsor Provides</p>
                <ul className="space-y-1">
                  {deal.sponsorProvides.map((item, i) => (
                    <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                      {item.item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">College Promises</p>
                <div className="flex flex-wrap gap-1.5">
                  {deal.collegePromises.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-brown">
              <span>Value: <span className="font-bold text-espresso">{deal.estimatedTotalValue}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-taupe" />
                Approved {deal.approvedAt} by {deal.approvedBy}
              </span>
            </div>
          </div>
        ))}
      </div>

      {approvedDeals.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center">
          <p className="text-sm text-brown">No approved deals yet.</p>
        </div>
      )}
    </div>
  );
}
