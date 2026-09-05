import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Eye, Edit, Users, Calendar, Tag, Trash2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import CreateSponsorshipPostModal from "./CreateSponsorshipPostModal";
import Modal from "../common/Modal";
import { addSponsorshipPost, createEventThunk, updateEventThunk } from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

import { useAuth } from "../../hooks/useAuth";

export default function SponsorshipPosts() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allPosts = useSelector((state) => state.sponsorship.posts);

  const posts = allPosts.filter((e) => {
    if (!user) return true;
    const userHexId = user._id || user.id;
    const userOrg = (user.organizationName || user.committee || "").toLowerCase();

    const createdByHex = e.createdBy ? (e.createdBy._id || e.createdBy).toString() : null;
    if (createdByHex && userHexId && createdByHex === userHexId.toString()) {
      return true;
    }
    if (e.committeeName && userOrg && e.committeeName.toLowerCase() === userOrg) {
      return true;
    }
    if (e.committee && userOrg && e.committee.toLowerCase() === userOrg) {
      return true;
    }
    return !createdByHex && !e.committeeName;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedPostForView, setSelectedPostForView] = useState(null);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState(null);

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLookingFor, setEditLookingFor] = useState("");
  const [editCanOffer, setEditCanOffer] = useState("");

  const handleCreatePost = async (newPostData) => {
    try {
      await dispatch(createEventThunk(newPostData)).unwrap();
      dispatch(
        addNotification({
          role: "Committee Head",
          title: "Sponsorship Post Created",
          message: `Post for "${newPostData.eventName || newPostData.title}" created successfully.`,
        })
      );
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to save sponsorship post in backend:", err);
      throw err;
    }
  };

  const openEditModal = (post) => {
    setSelectedPostForEdit(post);
    setEditTitle(post.eventName || post.title || "");
    setEditDescription(post.description || "");
    setEditLookingFor(Array.isArray(post.lookingFor) ? post.lookingFor.join(", ") : post.lookingFor || "");
    setEditCanOffer(Array.isArray(post.canOffer) ? post.canOffer.join(", ") : post.canOffer || "");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedPostForEdit) return;

    const id = selectedPostForEdit._id || selectedPostForEdit.id;
    const updatedData = {
      eventName: editTitle,
      title: editTitle,
      description: editDescription,
      lookingFor: editLookingFor ? editLookingFor.split(",").map((s) => s.trim()) : [],
      canOffer: editCanOffer ? editCanOffer.split(",").map((s) => s.trim()) : [],
      committeeName: selectedPostForEdit.committeeName || "CSI Student Chapter",
    };

    dispatch(updateEventThunk({ id, eventData: updatedData }));
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Post Updated",
        message: `Sponsorship post "${editTitle}" updated.`,
      })
    );
    setSelectedPostForEdit(null);
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Sponsorship Posts</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Post requirements to attract sponsors for your events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          Create Sponsorship Post
        </button>
      </div>

      {/* Post Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Post Header */}
            <div className="bg-[var(--brand-primary)] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{post.eventName || post.title}</h3>
                  <p className="text-[10px] text-white/80 font-semibold uppercase tracking-wider mt-1">
                    LOOKING FOR SPONSORS
                  </p>
                </div>
                <StatusBadge status={post.status || "Active"} />
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {post.participants || "500+"} Participants
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {post.eventType || "Technical Festival"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.eventDate || "TBD"}
                </span>
              </div>
            </div>

            {/* Post Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Looking For */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(post.lookingFor || []).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Can Offer */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">We Can Offer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(post.canOffer || []).slice(0, 5).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                        {item}
                      </span>
                    ))}
                    {(post.canOffer || []).length > 5 && (
                      <span className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] text-[var(--text-primary)] font-bold border border-[var(--border-subtle)]">
                        +{(post.canOffer || []).length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Brands Interested */}
                <div className="bg-[var(--bg-surface-alt)] rounded-xl px-3 py-2 border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Brands Interested</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{post.brandsInterested || 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedPostForView(post)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Post
                </button>
                <button
                  onClick={() => openEditModal(post)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-10 border border-[var(--border-subtle)] text-center space-y-3">
          <Calendar className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No sponsorship posts created yet</h3>
          <p className="text-xs text-[var(--text-secondary)]">Create an event to publish your sponsorship post to corporate sponsors.</p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreateSponsorshipPostModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      )}

      {/* View Post Modal */}
      <Modal
        isOpen={!!selectedPostForView}
        onClose={() => setSelectedPostForView(null)}
        title={selectedPostForView?.eventName || selectedPostForView?.title || "Sponsorship Post"}
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedPostForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Committee</span>
                <span className="font-semibold">{selectedPostForView.committeeName || "CSI Student Chapter"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Event Date</span>
                <span className="font-semibold">{selectedPostForView.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Brands Interested</span>
                <span className="font-bold text-[var(--brand-primary)]">{selectedPostForView.brandsInterested || 0}</span>
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Looking For</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedPostForView.lookingFor || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs border border-[var(--border-subtle)] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">We Can Offer</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedPostForView.canOffer || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] rounded-lg text-xs border border-[var(--border-subtle)] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPostForView(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        isOpen={!!selectedPostForEdit}
        onClose={() => setSelectedPostForEdit(null)}
        title="Edit Sponsorship Post"
        icon={Edit}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="p-6 space-y-4 font-sans-ui">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Post Title / Event Name</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Looking For (comma separated)</label>
            <input
              type="text"
              value={editLookingFor}
              onChange={(e) => setEditLookingFor(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Can Offer (comma separated)</label>
            <input
              type="text"
              value={editCanOffer}
              onChange={(e) => setEditCanOffer(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedPostForEdit(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
            >
              Save Post
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
