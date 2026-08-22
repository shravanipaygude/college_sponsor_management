import React, { useState } from "react";
import { Eye, Edit, Send, CheckCircle, FileCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import Modal from "../common/Modal";
import { committeeDeals as initialDeals } from "../../data/mockData";

export default function CommitteeDeals() {
  const [deals, setDeals] = useState(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleMarkAgreed = (id) => {
    setDeals(deals.map((d) => d.id === id ? { ...d, status: "Deal Agreed", agreedAt: "Just now" } : d));
    setSelectedDeal(null);
  };

  const handleSendForApproval = (id) => {
    setDeals(deals.map((d) => d.id === id ? { ...d, status: "Awaiting Faculty Approval", facultyStatus: "Pending" } : d));
    setSelectedDeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <h2 className="text-xl font-bold text-espresso tracking-tight">Sponsorship Deals</h2>
        <p className="text-xs text-brown mt-1">View and manage finalized sponsorship agreements</p>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="bg-espresso p-4 text-offWhite flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {deal.brandLogo}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{deal.brandName}</h3>
                  <p className="text-[10px] text-taupe">{deal.eventName}</p>
                </div>
              </div>
              <StatusBadge status={deal.status} />
            </div>

            <div className="p-5 space-y-3">
              {/* Sponsor Provides */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Sponsor Provides</p>
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

              {/* Committee Provides */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Committee Provides</p>
                <div className="flex flex-wrap gap-1.5">
                  {deal.committeeProvides.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                <span className="text-xs text-brown font-medium">Estimated Total Value</span>
                <span className="text-base font-black text-espresso">{deal.estimatedTotalValue}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-taupe/20">
                <button
                  onClick={() => setSelectedDeal(deal)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Deal
                </button>

                {deal.status === "Discussing" && (
                  <>
                    <button
                      onClick={() => alert(`Editing terms for ${deal.brandName}`)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-taupe/20 hover:bg-taupe/30 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Terms
                    </button>
                    <button
                      onClick={() => handleMarkAgreed(deal.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Deal Agreed
                    </button>
                  </>
                )}

                {deal.status === "Deal Agreed" && !deal.facultyStatus && (
                  <button
                    onClick={() => handleSendForApproval(deal.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send for Faculty Approval
                  </button>
                )}

                {deal.facultyStatus && (
                  <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brown">
                    <FileCheck className="w-3.5 h-3.5 text-taupe" />
                    Faculty: {deal.facultyStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deal Detail Modal */}
      <Modal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title="Sponsorship Deal"
        icon={FileCheck}
      >
        {selectedDeal && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider">Brand</p>
                <h4 className="text-xl font-bold text-espresso">{selectedDeal.brandName}</h4>
                <p className="text-xs text-brown mt-0.5">Event: {selectedDeal.eventName}</p>
              </div>
              <StatusBadge status={selectedDeal.status} />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-espresso uppercase">Sponsor Provides</p>
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
              <p className="text-xs font-bold text-espresso uppercase">Committee Provides</p>
              {selectedDeal.committeeProvides.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-offWhite/50 rounded-lg border border-taupe/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                  <span className="text-xs text-darkBrown font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-offWhite/40 border-t border-taupe/20 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6">
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
