import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, MapPin, Users, Edit, Eye, Plus, Trash2, X, Tag } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import CreateSponsorshipPostModal from "./CreateSponsorshipPostModal";
import Modal from "../common/Modal";
import {
  createEventThunk,
  updateEventThunk,
  deleteEventThunk,
  addSponsorshipPost,
  fetchEventsThunk,
} from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

import { useAuth } from "../../hooks/useAuth";

export default function MyEvents() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allPosts = useSelector((state) => state.sponsorship.posts);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  const posts = allPosts.filter((e) => {
    if (!user) return false;
    const userHexId = String(user._id || user.id || "");
    const userOrg = (user.organizationName || user.committee || "").toLowerCase().trim();

    const createdByHex = e.createdBy ? String(e.createdBy._id || e.createdBy) : null;
    if (createdByHex && userHexId && createdByHex === userHexId) {
      return true;
    }
    const commName = (e.committeeName || e.committee || "").toLowerCase().trim();
    if (commName && userOrg && commName === userOrg) {
      return true;
    }
    return false;
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventForView, setSelectedEventForView] = useState(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLookingFor, setEditLookingFor] = useState("");
  const [editCanOffer, setEditCanOffer] = useState("");

  const handleCreatePost = async (newPostData) => {
    try {
      const postPayload = {
        ...newPostData,
        createdBy: user?._id || user?.id,
        committeeName: user?.organizationName || user?.committee || "College Committee",
        collegeName: user?.collegeName || user?.college || "VESIT",
      };
      await dispatch(createEventThunk(postPayload)).unwrap();
      dispatch(
        addNotification({
          role: "Committee Head",
          title: "Event Created",
          message: `Event "${newPostData.eventName || newPostData.title}" created successfully.`,
        })
      );
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to save event in backend:", err);
      throw err;
    }
  };

  const openEditModal = (event) => {
    setSelectedEventForEdit(event);
    setEditTitle(event.eventName || event.title || "");
    setEditType(event.eventType || "Technical Festival");
    setEditDate(event.eventDate || "TBD");
    setEditDescription(event.description || "");
    setEditLookingFor(
      Array.isArray(event.lookingFor) ? event.lookingFor.join(", ") : event.lookingFor || ""
    );
    setEditCanOffer(
      Array.isArray(event.canOffer) ? event.canOffer.join(", ") : event.canOffer || ""
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedEventForEdit) return;

    const id = selectedEventForEdit._id || selectedEventForEdit.id;
    const updatedData = {
      eventName: editTitle,
      title: editTitle,
      eventType: editType,
      eventDate: editDate,
      description: editDescription,
      lookingFor: editLookingFor ? editLookingFor.split(",").map((s) => s.trim()) : [],
      canOffer: editCanOffer ? editCanOffer.split(",").map((s) => s.trim()) : [],
      committeeName: selectedEventForEdit.committeeName || "CSI Student Chapter",
    };

    dispatch(updateEventThunk({ id, eventData: updatedData }));
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Event Updated",
        message: `Event "${editTitle}" updated successfully.`,
      })
    );
    setSelectedEventForEdit(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedEventForDelete) return;
    const id = selectedEventForDelete._id || selectedEventForDelete.id;
    dispatch(deleteEventThunk(id));
    dispatch(
      addNotification({
        role: "Committee Head",
        title: "Event Deleted",
        message: `Event "${selectedEventForDelete.eventName || selectedEventForDelete.title}" deleted.`,
      })
    );
    setSelectedEventForDelete(null);
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">My Events</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Manage committee events and sponsorship requirements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          Create Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((event) => (
          <div
            key={event.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
          >
            {/* Event Header */}
            <div className="bg-[var(--brand-primary)] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{event.eventName || event.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{event.eventType || "Event"}</p>
                </div>
                <StatusBadge status={event.status || "Active"} />
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed line-clamp-2">
                {event.description || `${event.eventName} organized by ${event.committeeName || "Committee"}.`}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] bg-[var(--bg-surface-alt)] px-3 py-2 rounded-xl border border-[var(--border-subtle)]">
                  <Calendar className="w-4 h-4 text-[var(--brand-royal)] shrink-0" />
                  <span>{event.eventDate || "TBD"}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)] bg-[var(--bg-surface-alt)] px-3 py-2 rounded-xl border border-[var(--border-subtle)]">
                  <Users className="w-4 h-4 text-[var(--brand-royal)] shrink-0" />
                  <span>{event.participants || "500+"} Participants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedEventForView(event)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(event)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setSelectedEventForDelete(event)}
                  className="p-2 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-10 border border-[var(--border-subtle)] text-center space-y-3">
          <Calendar className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No events created yet</h3>
          <p className="text-xs text-[var(--text-secondary)]">Click &apos;Create Event&apos; above to post your committee&apos;s sponsorship requirements.</p>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateSponsorshipPostModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      )}

      {/* View Event Modal */}
      <Modal
        isOpen={!!selectedEventForView}
        onClose={() => setSelectedEventForView(null)}
        title={selectedEventForView?.eventName || selectedEventForView?.title || "Event Details"}
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedEventForView && (
          <div className="p-6 space-y-4 font-sans-ui text-sm text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Committee</span>
                <span className="font-semibold text-xs">{selectedEventForView.committeeName || "CSI Student Chapter"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Event Date</span>
                <span className="font-semibold text-xs">{selectedEventForView.eventDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Event Category</span>
                <span className="font-semibold text-xs">{selectedEventForView.eventType || "Technical Festival"}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Description</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedEventForView.description || "No description provided for this event."}
              </p>
            </div>

            <div>
              <p className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">Looking For</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedEventForView.lookingFor || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase mb-1.5">Benefits Offered</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedEventForView.canOffer || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] rounded-lg text-xs font-medium border border-[var(--border-subtle)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEventForView(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={!!selectedEventForEdit}
        onClose={() => setSelectedEventForEdit(null)}
        title="Edit Event"
        icon={Edit}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="p-6 space-y-4 font-sans-ui">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Event Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Event Type</label>
              <input
                type="text"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Event Date</label>
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
              />
            </div>
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
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Benefits Offered (comma separated)</label>
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
              onClick={() => setSelectedEventForEdit(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!selectedEventForDelete}
        onClose={() => setSelectedEventForDelete(null)}
        title="Confirm Delete"
        icon={Trash2}
        maxWidth="max-w-sm"
      >
        <div className="p-6 space-y-4 font-sans-ui">
          <p className="text-xs text-[var(--text-primary)]">
            Are you sure you want to delete <span className="font-bold">{selectedEventForDelete?.eventName || selectedEventForDelete?.title}</span>? This action will persist in MongoDB.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedEventForDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete Event
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
