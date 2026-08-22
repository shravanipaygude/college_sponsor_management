import React from "react";
import { CheckCircle, XCircle, Clock, History } from "lucide-react";
import { approvalHistory } from "../../data/mockData";

export default function ApprovalHistory() {
  const getActionStyle = (action) => {
    switch (action) {
      case "Approved":
        return { icon: CheckCircle, bgClass: "bg-taupe/20 text-espresso", dotClass: "bg-taupe" };
      case "Rejected":
        return { icon: XCircle, bgClass: "bg-darkBrown/10 text-darkBrown", dotClass: "bg-darkBrown" };
      case "Pending":
        return { icon: Clock, bgClass: "bg-offWhite text-brown", dotClass: "bg-brown" };
      default:
        return { icon: Clock, bgClass: "bg-offWhite text-brown", dotClass: "bg-brown" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brown" />
          <h2 className="text-xl font-bold text-espresso tracking-tight">Approval History</h2>
        </div>
        <p className="text-xs text-brown mt-1">Chronological record of all approval actions</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-taupe/30 shadow-sm p-6">
        <div className="space-y-0">
          {approvalHistory.map((entry, idx) => {
            const { icon: Icon, bgClass, dotClass } = getActionStyle(entry.action);
            const isLast = idx === approvalHistory.length - 1;

            return (
              <div key={entry.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-taupe/20 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-espresso">
                        {entry.brandName} × {entry.eventName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          entry.action === "Approved"
                            ? "bg-taupe/30 text-espresso border-taupe/50"
                            : entry.action === "Rejected"
                            ? "bg-darkBrown/15 text-darkBrown border-darkBrown/30"
                            : "bg-offWhite text-brown border-taupe/40"
                        }`}>
                          {entry.action}
                        </span>
                        {entry.remarks && (
                          <span className="text-[10px] text-brown italic">"{entry.remarks}"</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-brown font-medium shrink-0">{entry.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
