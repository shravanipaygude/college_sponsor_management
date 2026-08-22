import React from "react";
import { Bookmark, Eye, Heart, Users, Calendar, Tag, Trash2 } from "lucide-react";
import { useSavedItems } from "../../hooks/useSavedItems";
import { useAuth } from "../../hooks/useAuth";
import { sponsorshipPostsForBrand } from "../../data/mockData";

/**
 * SavedEvents — Displays events bookmarked by the Corporate Sponsor user.
 * Uses the useSavedItems custom hook keyed by user ID.
 */
export default function SavedEvents() {
  const { user } = useAuth();

  // useSavedItems provides reusable save/unsave behavior for events.
  const { savedItems, removeItem } = useSavedItems(
    user ? `sf_saved_events_${user.id}` : null
  );

  // Find full event data for each saved ID
  const savedEvents = sponsorshipPostsForBrand.filter((post) =>
    savedItems.includes(post.id)
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
              Saved Events
            </h2>
            <p className="text-xs text-brown mt-0.5">
              {savedEvents.length} event{savedEvents.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
      </div>

      {/* Saved Event Cards */}
      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedEvents.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Event Header */}
              <div className="bg-espresso p-4 text-offWhite">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                      {post.collegeLogo}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{post.eventName}</h3>
                      <p className="text-[10px] text-taupe font-medium">{post.collegeName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(post.id)}
                    className="p-1.5 rounded-lg text-taupe hover:text-red-300 hover:bg-darkBrown transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-taupe/90">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {post.participants} Expected
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.eventType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.eventDate}
                  </span>
                </div>
              </div>

              {/* Post Body */}
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.lookingFor.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-offWhite rounded text-[10px] text-darkBrown font-medium border border-taupe/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-1.5">Can Offer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.canOffer.map((item, i) => (
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
                  onClick={() => alert(`Viewing event: ${post.eventName}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Event
                </button>
                <button
                  onClick={() => alert(`Interest expressed in ${post.eventName}!`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Express Interest
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
          <h3 className="text-lg font-bold text-espresso">No Saved Events</h3>
          <p className="text-sm text-brown max-w-sm mx-auto leading-relaxed">
            You haven&apos;t saved any events yet. Discover college sponsorship
            posts and save the ones that interest your brand.
          </p>
        </div>
      )}
    </div>
  );
}
