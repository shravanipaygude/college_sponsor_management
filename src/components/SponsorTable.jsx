import React from "react";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  MessageSquare,
  IndianRupee,
  Gift,
  Laptop,
  Layers,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { sponsorsData } from "../data/mockData";

export default function SponsorTable({ onSelectSponsor }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          bg: "bg-taupe/30 text-espresso border-taupe/50",
          icon: CheckCircle2,
        };
      case "Negotiating":
        return {
          bg: "bg-darkBrown text-offWhite border-espresso",
          icon: MessageSquare,
        };
      case "Pending Approval":
        return {
          bg: "bg-offWhite text-brown border-taupe/40",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-taupe/20 text-darkBrown border-taupe/30",
          icon: Clock,
        };
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "Monetary":
        return { bg: "bg-espresso/10 text-espresso border-espresso/20", icon: IndianRupee };
      case "In-Kind":
        return { bg: "bg-taupe/20 text-darkBrown border-taupe/30", icon: Gift };
      case "Digital / Service":
        return { bg: "bg-brown/15 text-brown border-brown/30", icon: Laptop };
      case "Hybrid":
        return { bg: "bg-darkBrown/15 text-darkBrown border-darkBrown/30 font-bold", icon: Layers };
      default:
        return { bg: "bg-taupe/20 text-darkBrown border-taupe/30", icon: Gift };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-taupe/30 shadow-sm overflow-hidden space-y-0">
      {/* Header Bar */}
      <div className="p-5 border-b border-taupe/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-offWhite/30">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">
            Current Sponsorship Deals
          </h2>
          <p className="text-xs text-brown">
            Overview of confirmed & negotiating partner deals across cash, in-kind, digital, and hybrid contributions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-espresso bg-taupe/20 border border-taupe/30 px-3 py-1 rounded-lg">
            {sponsorsData.length} Active Deals
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-espresso text-taupe text-[11px] font-bold uppercase tracking-wider border-b border-taupe/20">
              <th className="py-3.5 px-6">Sponsor</th>
              <th className="py-3.5 px-6">Contribution Type</th>
              <th className="py-3.5 px-6">Contribution</th>
              <th className="py-3.5 px-6">Estimated Value</th>
              <th className="py-3.5 px-6">Deal Status</th>
              <th className="py-3.5 px-6">Deliverables</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/15 text-xs text-darkBrown">
            {sponsorsData.map((sponsor) => {
              const statusBadge = getStatusBadge(sponsor.status);
              const StatusIcon = statusBadge.icon;

              const typeBadge = getTypeBadge(sponsor.contributionType);
              const TypeIcon = typeBadge.icon;

              const isCustom = sponsor.structure === "Custom Partnership";

              return (
                <tr
                  key={sponsor.id}
                  className="hover:bg-offWhite/40 transition-colors"
                >
                  {/* Sponsor Name & Category */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-bold text-espresso">{sponsor.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-brown font-medium">
                          {sponsor.category}
                        </span>
                        <span className="text-taupe/40">•</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            isCustom
                              ? "bg-darkBrown/10 text-darkBrown"
                              : "bg-taupe/20 text-espresso"
                          }`}
                        >
                          {sponsor.structure}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contribution Type */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeBadge.bg}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                      {sponsor.contributionType}
                    </span>
                  </td>

                  {/* Contribution Details */}
                  <td className="py-4 px-6 font-semibold text-darkBrown">
                    {sponsor.contribution}
                  </td>

                  {/* Estimated Value */}
                  <td className="py-4 px-6 font-extrabold text-espresso text-sm">
                    {sponsor.estimatedValue}
                  </td>

                  {/* Deal Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge.bg}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {sponsor.status}
                    </span>
                  </td>

                  {/* Deliverables */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-espresso">
                        {sponsor.deliverables}
                      </span>
                      <span className="text-[10px] text-brown">completed</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelectSponsor(sponsor)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors"
                    >
                      <span>Manage</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Card View */}
      <div className="lg:hidden divide-y divide-taupe/15 p-4 space-y-4">
        {sponsorsData.map((sponsor) => {
          const statusBadge = getStatusBadge(sponsor.status);
          const StatusIcon = statusBadge.icon;

          const typeBadge = getTypeBadge(sponsor.contributionType);
          const TypeIcon = typeBadge.icon;

          return (
            <div
              key={sponsor.id}
              className="bg-offWhite/40 rounded-xl p-4 border border-taupe/20 space-y-3 pt-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-espresso">
                    {sponsor.name}
                  </h3>
                  <p className="text-xs text-brown">{sponsor.category}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge.bg}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {sponsor.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-white rounded-lg border border-taupe/15">
                <div>
                  <span className="text-[10px] text-brown font-semibold uppercase">
                    Type
                  </span>
                  <p className="font-bold text-espresso flex items-center gap-1">
                    <TypeIcon className="w-3 h-3 text-taupe" />
                    {sponsor.contributionType}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-brown font-semibold uppercase">
                    Est. Value
                  </span>
                  <p className="font-extrabold text-espresso">{sponsor.estimatedValue}</p>
                </div>
                <div className="col-span-2 pt-1 border-t border-taupe/10">
                  <span className="text-[10px] text-brown font-semibold uppercase">
                    Contribution
                  </span>
                  <p className="font-medium text-darkBrown">{sponsor.contribution}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectSponsor(sponsor)}
                className="w-full py-2 rounded-lg text-xs font-bold text-espresso bg-taupe/20 hover:bg-espresso hover:text-offWhite transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Deal Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
