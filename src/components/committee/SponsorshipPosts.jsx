import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Eye, Edit, Users, Calendar, Tag } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import CreateSponsorshipPostModal from "./CreateSponsorshipPostModal";
import { addSponsorshipPost } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

export default function SponsorshipPosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.sponsorship.posts);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePost = (newPostData) => {
    dispatch(addSponsorshipPost(newPostData));
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Sponsorship Post Created",
        message: `Sponsorship post for "${newPostData.eventName || newPostData.title}" published.`,
      })
    );
    setShowCreateModal(false);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">Sponsorship Posts</h2>
          <p className="text-xs text-brown mt-1">Post requirements to attract sponsors for your events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-taupe" />
          Create Sponsorship Post
        </button>
      </div>

      {/* Post Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Post Header */}
            <div className="bg-espresso p-5 text-offWhite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{post.eventName}</h3>
                  <p className="text-[10px] text-taupe font-semibold uppercase tracking-wider mt-1">
                    LOOKING FOR SPONSORS
                  </p>
                </div>
                <StatusBadge status={post.status} />
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-taupe/90">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {post.participants} Participants
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {post.eventType}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.eventDate}
                </span>
              </div>
            </div>

            {/* Post Body */}
            <div className="p-5 space-y-4">
              {/* Looking For */}
              <div>
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-2">Looking For</p>
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
                <p className="text-[10px] font-bold text-brown uppercase tracking-wider mb-2">We Can Offer</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.canOffer.slice(0, 5).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-taupe/10 rounded text-[10px] text-espresso font-medium border border-taupe/20">
                      {item}
                    </span>
                  ))}
                  {post.canOffer.length > 5 && (
                    <span className="px-2 py-0.5 bg-taupe/20 rounded text-[10px] text-espresso font-bold border border-taupe/30">
                      +{post.canOffer.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Brands Interested */}
              <div className="bg-offWhite/50 rounded-lg px-3 py-2 border border-taupe/20 flex items-center justify-between">
                <span className="text-xs text-brown font-medium">Brands Interested</span>
                <span className="text-lg font-black text-espresso">{post.brandsInterested}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-taupe/20">
                <button
                  onClick={() => alert(`Viewing post: ${post.title}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Post
                </button>
                <button
                  onClick={() => alert(`Editing post: ${post.title}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreateSponsorshipPostModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      )}
    </div>
  );
}
