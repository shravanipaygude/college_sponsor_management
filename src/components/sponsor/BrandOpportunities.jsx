import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Eye, Edit, Users, Tag } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import CreateOpportunityModal from "./CreateOpportunityModal";
import { addBrandOpportunity } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function BrandOpportunities() {
  const dispatch = useDispatch();
  const opportunities = useSelector((state) => state.sponsorship.opportunities);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = (newOppData) => {
    dispatch(addBrandOpportunity(newOppData));
    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Opportunity Published",
        message: `Sponsorship opportunity "${newOppData.title}" published.`,
      })
    );
    setShowCreateModal(false);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">Our Sponsorship Opportunities</h2>
          <p className="text-xs text-brown mt-1">Publish what you can offer to college events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-taupe" />
          Post Opportunity
        </button>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="bg-espresso p-5 text-offWhite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold tracking-tight">{opp.title}</h3>
                  <p className="text-xs text-taupe mt-1">{opp.about}</p>
                </div>
                <StatusBadge status={opp.status} />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Interested In */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Events We're Interested In</p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.interestedIn.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-offWhite rounded text-[10px] text-darkBrown font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* What We Provide */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">What We Can Provide</p>
                <ul className="space-y-1">
                  {(opp.canProvide || []).map((item, i) => {
                    const text = typeof item === "string" ? item : item.item || String(item);
                    const typeLabel = typeof item === "object" ? item.type : null;
                    return (
                      <li key={i} className="text-xs text-darkBrown flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                        {text}
                        {typeLabel && (
                          <span className="text-[9px] text-brown bg-offWhite px-1.5 py-0.5 rounded ml-auto shrink-0">{typeLabel}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Estimated Value */}
              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                <span className="text-xs text-brown font-medium">Estimated Value</span>
                <span className="text-base font-black text-espresso">{opp.estimatedValue || "₹50,000"}</span>
              </div>

              {/* Expectations */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">What We Expect</p>
                <div className="flex flex-wrap gap-1.5">
                  {(opp.expectations || opp.lookingFor || []).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responses */}
              <div className="flex items-center justify-between text-xs text-brown">
                <span>{opp.responses} college responses</span>
                <span>Posted {opp.createdAt}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-taupe/20">
                <button
                  onClick={() => alert(`Viewing opportunity: ${opp.title}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => alert(`Editing opportunity: ${opp.title}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateOpportunityModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}
