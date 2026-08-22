import React, { useState } from "react";
import { Search, Eye, Heart, Users, Calendar, Tag } from "lucide-react";
import { sponsorshipPostsForBrand } from "../../data/mockData";

const filterCategories = ["All", "Hackathons", "Tech Events", "Cultural", "Sports", "Entrepreneurship", "Other"];

export default function DiscoverEvents() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expressedInterest, setExpressedInterest] = useState([]);

  const filtered = sponsorshipPostsForBrand.filter((post) => {
    if (activeFilter !== "All") {
      const categoryMap = {
        "Hackathons": "Tech",
        "Tech Events": "Tech",
        "Cultural": "Cultural",
        "Sports": "Sports",
        "Entrepreneurship": "Entrepreneurship",
      };
      if (post.category !== categoryMap[activeFilter]) return false;
    }
    if (searchQuery && !post.eventName.toLowerCase().includes(searchQuery.toLowerCase()) && !post.collegeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">Discover College Events</h2>
          <p className="text-xs text-brown mt-1">Browse sponsorship posts from college committees</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
          <input
            type="text"
            placeholder="Search events or colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offWhite/50 border border-taupe/30 rounded-lg pl-9 pr-3 py-2 text-xs text-darkBrown placeholder:text-brown/60 focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterCategories.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === f
                ? "bg-espresso text-offWhite shadow-sm"
                : "bg-white text-darkBrown border border-taupe/30 hover:bg-offWhite"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* Event Header */}
            <div className="bg-espresso p-4 text-offWhite">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-darkBrown text-taupe flex items-center justify-center font-bold text-sm border border-taupe/30">
                  {post.collegeLogo}
                </div>
                <div>
                  <h3 className="text-base font-bold">{post.eventName}</h3>
                  <p className="text-[10px] text-taupe font-medium">{post.collegeName}</p>
                </div>
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
              {/* Looking For */}
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

              {/* Can Offer */}
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
                onClick={() => {
                  setExpressedInterest([...expressedInterest, post.id]);
                  alert(`Interest expressed in ${post.eventName}!`);
                }}
                disabled={expressedInterest.includes(post.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  expressedInterest.includes(post.id)
                    ? "bg-taupe/30 text-brown cursor-not-allowed"
                    : "bg-espresso text-offWhite hover:bg-darkBrown"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                {expressedInterest.includes(post.id) ? "Interest Expressed" : "Express Interest"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-taupe/30 text-center">
          <p className="text-sm text-brown">No events match your filters.</p>
        </div>
      )}
    </div>
  );
}
