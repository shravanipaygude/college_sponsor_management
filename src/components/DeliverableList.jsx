import React from "react";
import { Eye, Calendar, UserCheck, CheckCircle2, Clock, FileCheck } from "lucide-react";
import { deliverablesData } from "../data/mockData";

export default function DeliverableList({ onOpenModal }) {
  const getDeliverableBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-taupe/30 text-espresso border-taupe/50";
      case "In Progress":
        return "bg-offWhite text-brown border-taupe/40";
      case "Proof Submitted":
        return "bg-taupe/20 text-darkBrown border-taupe/40 font-semibold";
      case "Pending":
        return "bg-darkBrown/10 text-brown border-taupe/20";
      default:
        return "bg-taupe/20 text-darkBrown border-taupe/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">
            Deliverable Tracking
          </h2>
          <p className="text-xs text-brown">
            Promised assets, promotional banners, and campaign tasks
          </p>
        </div>
        <span className="text-xs font-semibold text-espresso bg-taupe/20 px-3 py-1 rounded-lg border border-taupe/30">
          4 Tasks Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {deliverablesData.map((item) => {
          const badgeClass = getDeliverableBadge(item.status);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-espresso leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brown font-semibold mt-0.5">
                      Sponsor: <span className="text-darkBrown font-bold">{item.sponsor}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-offWhite/40 rounded-lg border border-taupe/15">
                  <div className="flex items-center gap-1.5 text-brown">
                    <Calendar className="w-3.5 h-3.5 text-taupe shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase font-bold text-brown/70">
                        Deadline
                      </p>
                      <p className="font-medium text-darkBrown">{item.deadline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-brown">
                    <UserCheck className="w-3.5 h-3.5 text-taupe shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase font-bold text-brown/70">
                        Assigned
                      </p>
                      <p className="font-medium text-darkBrown">{item.assigned}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-taupe/20 flex items-center justify-between">
                <span className="text-[10px] text-brown">
                  Updated: {item.updatedAt}
                </span>

                <button
                  onClick={() => onOpenModal(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
