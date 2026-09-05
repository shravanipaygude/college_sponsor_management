import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Eye, Edit, Tag, Trash2, Building2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import CreateOpportunityModal from "./CreateOpportunityModal";
import Modal from "../common/Modal";
import {
  addBrandOpportunity,
  createOpportunityThunk,
  updateOpportunityThunk,
  deleteOpportunityThunk,
  fetchOpportunitiesThunk,
} from "../../store/slices/sponsorshipSlice";
import { addNotification } from "../../store/slices/notificationSlice";

import { useAuth } from "../../hooks/useAuth";

export default function BrandOpportunities() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const allOpportunities = useSelector((state) => state.sponsorship.opportunities);

  useEffect(() => {
    dispatch(fetchOpportunitiesThunk());
  }, [dispatch]);

  const opportunities = allOpportunities.filter((o) => {
    if (!user) return false;
    const userHexId = String(user._id || user.id || "");
    const userOrg = (user.organizationName || user.company || user.name || "").toLowerCase().trim();

    const createdByHex = o.createdBy ? String(o.createdBy._id || o.createdBy) : null;
    if (createdByHex && userHexId && createdByHex === userHexId) {
      return true;
    }
    const oppComp = (o.companyName || o.brandName || "").toLowerCase().trim();
    if (oppComp && userOrg && oppComp === userOrg) {
      return true;
    }
    return false;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedOppForView, setSelectedOppForView] = useState(null);
  const [selectedOppForEdit, setSelectedOppForEdit] = useState(null);
  const [selectedOppForDelete, setSelectedOppForDelete] = useState(null);

  // Edit states
  const [editBrandName, setEditBrandName] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editContributionType, setEditContributionType] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editCanProvide, setEditCanProvide] = useState("");
  const [editExpectations, setEditExpectations] = useState("");

  const handleCreate = (newOppData) => {
    dispatch(createOpportunityThunk(newOppData));
    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Opportunity Published",
        message: `Sponsorship opportunity "${newOppData.title || newOppData.brandName}" published.`,
      })
    );
    setShowCreateModal(false);
  };

  const openEditModal = (opp) => {
    setSelectedOppForEdit(opp);
    setEditBrandName(opp.brandName || "");
    setEditIndustry(opp.industry || "AI / Technology");
    setEditContributionType(opp.contributionType || "Hybrid");
    setEditValue(opp.estimatedValue || "₹50,000");
    setEditAbout(opp.about || opp.description || "");
    setEditCanProvide(Array.isArray(opp.canProvide) ? opp.canProvide.join(", ") : opp.canProvide || "");
    setEditExpectations(
      Array.isArray(opp.expectations)
        ? opp.expectations.join(", ")
        : Array.isArray(opp.lookingFor)
        ? opp.lookingFor.join(", ")
        : opp.expectations || ""
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedOppForEdit) return;

    const id = selectedOppForEdit._id || selectedOppForEdit.id;
    const updatedData = {
      brandName: editBrandName,
      title: `${editBrandName} Sponsorship Program`,
      industry: editIndustry,
      contributionType: editContributionType,
      estimatedValue: editValue,
      about: editAbout,
      canProvide: editCanProvide ? editCanProvide.split(",").map((s) => s.trim()) : [],
      expectations: editExpectations ? editExpectations.split(",").map((s) => s.trim()) : [],
      lookingFor: editExpectations ? editExpectations.split(",").map((s) => s.trim()) : [],
    };

    dispatch(updateOpportunityThunk({ id, oppData: updatedData }));
    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Opportunity Updated",
        message: `Opportunity for "${editBrandName}" updated.`,
      })
    );
    setSelectedOppForEdit(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedOppForDelete) return;
    const id = selectedOppForDelete._id || selectedOppForDelete.id;
    dispatch(deleteOpportunityThunk(id));
    dispatch(
      addNotification({
        role: "Corporate Sponsor",
        title: "Opportunity Deleted",
        message: `Opportunity "${selectedOppForDelete.brandName}" deleted.`,
      })
    );
    setSelectedOppForDelete(null);
  };

  return (
    <div className="space-y-6 font-sans-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Our Opportunities</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Manage sponsorship programs published by your brand</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          Create Opportunity
        </button>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-[var(--brand-primary)] p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/30">
                    {opp.brandLogo || "NA"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{opp.brandName}</h3>
                    <p className="text-[10px] text-white/80 font-medium">{opp.tagline || "OPEN FOR COLLEGE SPONSORSHIPS"}</p>
                  </div>
                </div>
                <StatusBadge status={opp.status || "Active"} />
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {opp.industry || "AI / Technology"}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {opp.contributionType || "Hybrid"}
                </span>
                <span className="font-bold text-white">Est. Value: {opp.estimatedValue || "₹50,000"}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Can Provide */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">We Can Provide</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(opp.canProvide || []).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--brand-primary)]/15 rounded text-[10px] text-[var(--brand-primary)] font-medium border border-[var(--border-subtle)]">
                        {typeof item === 'string' ? item : item.item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Looking For */}
                <div>
                  <p className="text-[10px] font-mono font-bold text-[var(--brand-royal)] uppercase tracking-wider mb-2">Expectations / Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(opp.expectations || opp.lookingFor || []).map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--bg-surface-alt)] rounded text-[10px] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responses */}
                <div className="bg-[var(--bg-surface-alt)] rounded-xl px-3 py-2 border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">College Inquiries</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{opp.responses || 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setSelectedOppForView(opp)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(opp)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setSelectedOppForDelete(opp)}
                  className="p-2 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Opportunity"
                >
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="bg-[var(--bg-card)] rounded-3xl p-10 border border-[var(--border-subtle)] text-center space-y-3">
          <Building2 className="w-8 h-8 text-[var(--text-secondary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No opportunities created yet</h3>
          <p className="text-xs text-[var(--text-secondary)]">Click &apos;Create Opportunity&apos; above to publish a brand sponsorship program.</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateOpportunityModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedOppForView}
        onClose={() => setSelectedOppForView(null)}
        title={selectedOppForView?.brandName || "Opportunity Details"}
        icon={Eye}
        maxWidth="max-w-lg"
      >
        {selectedOppForView && (
          <div className="p-6 space-y-4 font-sans-ui text-xs text-[var(--text-primary)]">
            <div className="bg-[var(--bg-surface-alt)] p-4 rounded-2xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Industry</span>
                <span className="font-semibold">{selectedOppForView.industry || "AI / Technology"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Contribution Type</span>
                <span className="font-semibold">{selectedOppForView.contributionType || "Hybrid"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold text-[var(--brand-royal)] uppercase">Estimated Value</span>
                <span className="font-bold text-[var(--brand-primary)]">{selectedOppForView.estimatedValue || "₹50,000"}</span>
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">About Program</p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {selectedOppForView.about || selectedOppForView.description || "Corporate sponsorship program for college events."}
              </p>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">We Can Provide</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedOppForView.canProvide || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] rounded-lg text-xs border border-[var(--border-subtle)] font-medium">
                    {typeof item === 'string' ? item : item.item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono font-bold text-[var(--brand-royal)] uppercase mb-1">Expectations</p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedOppForView.expectations || selectedOppForView.lookingFor || []).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[var(--bg-surface-alt)] rounded-lg text-xs border border-[var(--border-subtle)] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOppForView(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!selectedOppForEdit}
        onClose={() => setSelectedOppForEdit(null)}
        title="Edit Opportunity"
        icon={Edit}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="p-6 space-y-4 font-sans-ui">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Brand / Company Name</label>
            <input
              type="text"
              value={editBrandName}
              onChange={(e) => setEditBrandName(e.target.value)}
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Industry</label>
              <input
                type="text"
                value={editIndustry}
                onChange={(e) => setEditIndustry(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Est. Value</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">About Program</label>
            <textarea
              value={editAbout}
              onChange={(e) => setEditAbout(e.target.value)}
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">We Can Provide (comma separated)</label>
            <input
              type="text"
              value={editCanProvide}
              onChange={(e) => setEditCanProvide(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-[var(--brand-royal)] uppercase">Expectations (comma separated)</label>
            <input
              type="text"
              value={editExpectations}
              onChange={(e) => setEditExpectations(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedOppForEdit(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand-primary)] text-white cursor-pointer"
            >
              Save Opportunity
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!selectedOppForDelete}
        onClose={() => setSelectedOppForDelete(null)}
        title="Confirm Delete"
        icon={Trash2}
        maxWidth="max-w-sm"
      >
        <div className="p-6 space-y-4 font-sans-ui">
          <p className="text-xs text-[var(--text-primary)]">
            Are you sure you want to delete <span className="font-bold">{selectedOppForDelete?.brandName}</span>? This action will persist in MongoDB.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedOppForDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
