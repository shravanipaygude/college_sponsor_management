import React from "react";
import { Bookmark, Search, Eye, Send, Tag, Trash2 } from "lucide-react";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import { brandOpportunitiesForCommittee } from "../../data/mockData";

/**
 * SavedSponsors — Displays sponsors bookmarked by the Committee user.
 * Uses the useSavedItems custom hook keyed by user ID.
 */
export default function SavedSponsors() {
  const { user } = useAuth();

  // useSavedItems provides reusable save/unsave behavior for sponsors.
  const { savedItems, removeItem } = useSavedItems(
    user ? `sf_saved_sponsors_${user.id}` : null
  );

  // Find full sponsor data for each saved ID
  const savedSponsors = brandOpportunitiesForCommittee.filter((opp) =>
    savedItems.includes(opp.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-taupe/20 text-espresso flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-espresso tracking-tight">
              Saved Sponsors
            </h2>
            <p className="text-xs text-brown mt-0.5">
              {savedSponsors.length} sponsor{savedSponsors.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      {/* Saved Sponsor Cards */}
      {savedSponsors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedSponsors.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="p-5 space-y-4 flex-1">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-espresso text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                      {opp.brandLogo}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-espresso">{opp.brandName}</h3>
                      <p className="text-[10px] text-brown font-semibold uppercase tracking-wider">
                        {opp.tagline}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(opp.id)}
                    className="p-1.5 rounded-lg text-brown hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-taupe/20 flex gap-2">
                <button
                  onClick={() => alert(`Viewing full opportunity from ${opp.brandName}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => alert(`Partnership request sent to ${opp.brandName}!`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Approach
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-10 border border-taupe/30 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-taupe/15 text-brown mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-espresso">No Saved Sponsors</h3>
          <p className="text-sm text-brown max-w-sm mx-auto leading-relaxed">
            You haven&apos;t saved any sponsors yet. Explore sponsorship
            opportunities and save the ones you want to revisit.
          </p>
        </div>
      )}
    </div>
  );
}
