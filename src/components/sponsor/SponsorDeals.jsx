import React, { useState } from "react";
import { Eye, FileCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { brandDeals as initialDeals } from "../../data/mockData";

export default function SponsorDeals() {
  const [deals, setDeals] = useState(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Sponsorship Deals</h2>
        <p className="text-xs text-brown mt-1">Your finalized sponsorship agreements with colleges</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="bg-espresso p-4 text-offWhite flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {deal.collegeLogo}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{deal.eventName}</h3>
                  <p className="text-[10px] text-taupe">{deal.collegeName}</p>
                </div>
              </div>
              <StatusBadge status={deal.status} />
            </div>

            <div className="p-5 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">You Provide</p>
                <ul className="space-y-1">
                  {deal.sponsorProvides.map((item, i) => (
                    <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                      {item.item}
                      <span className="text-[9px] text-brown bg-offWhite px-1.5 py-0.5 rounded ml-auto shrink-0">{item.type}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">College Provides</p>
                <div className="flex flex-wrap gap-1.5">
                  {deal.collegeProvides.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                <span className="text-xs text-brown font-medium">Estimated Total Value</span>
                <span className="text-base font-black text-espresso">{deal.estimatedTotalValue}</span>
              </div>

              <div className="pt-2 border-t border-taupe/20">
                <button
                  onClick={() => setSelectedDeal(deal)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Deal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deal Detail Modal */}
      <Modal isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} title="Sponsorship Deal" icon={FileCheck}>
        {selectedDeal && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider">College</p>
                <h4 className="text-xl font-bold text-espresso">{selectedDeal.collegeName}</h4>
                <p className="text-xs text-brown mt-0.5">Event: {selectedDeal.eventName}</p>
              </div>
              <StatusBadge status={selectedDeal.status} />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-espresso uppercase">You Provide</p>
              {selectedDeal.sponsorProvides.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-offWhite/50 rounded-lg border border-taupe/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                  <span className="text-xs text-darkBrown font-medium">{item.item}</span>
                  <span className="ml-auto text-[9px] text-brown bg-white px-1.5 py-0.5 rounded border border-taupe/20">{item.type}</span>
                </div>
              ))}
            </div>

            <div className="bg-offWhite/50 rounded-lg px-4 py-3 border border-taupe/20 text-center">
              <p className="text-[10px] font-bold text-brown uppercase">Estimated Total Value</p>
              <p className="text-2xl font-black text-espresso">{selectedDeal.estimatedTotalValue}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-espresso uppercase">College Provides</p>
              {selectedDeal.collegeProvides.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-offWhite/50 rounded-lg border border-taupe/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                  <span className="text-xs text-darkBrown font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end -mx-6 -mb-6 mt-6">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-darkBrown hover:bg-taupe/20 border border-taupe/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
