import React, { useState } from "react";
import {
  Check,
  Star,
  Plus,
  Eye,
  Edit,
  Copy,
  Power,
  Sliders,
} from "lucide-react";
import { packagesData } from "../data/mockData";

export default function PackageCard({ onCreatePackage }) {
  const [selectedPackageId, setSelectedPackageId] = useState("event");

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brown" />
            <h2 className="text-xl font-bold text-espresso tracking-tight">
              Partnership Packages
            </h2>
          </div>
          <p className="text-xs text-brown mt-1 max-w-2xl leading-relaxed">
            Create reusable partnership templates to speed up sponsorship negotiations. Packages can be customized for individual sponsors.
          </p>
        </div>

        <button
          onClick={() => {
            if (onCreatePackage) onCreatePackage();
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-taupe" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Package Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packagesData.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const isPopular = pkg.popular;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`relative bg-white rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-espresso ring-2 ring-espresso shadow-lg -translate-y-1"
                  : isPopular
                  ? "border-taupe shadow-md hover:shadow-lg hover:-translate-y-1"
                  : "border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-espresso text-taupe px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm border border-taupe/30">
                  <Star className="w-3 h-3 fill-taupe text-taupe" />
                  Most Popular
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="border-b border-taupe/20 pb-4">
                  <span className="text-[10px] font-bold text-brown uppercase tracking-wider">
                    Template Tier
                  </span>
                  <h3 className="text-lg font-extrabold text-espresso mt-0.5">
                    {pkg.name}
                  </h3>
                  <div className="mt-2 space-y-0.5">
                    <span className="text-[10px] text-brown font-semibold uppercase">
                      Suggested Contribution
                    </span>
                    <p className="text-2xl font-black text-espresso tracking-tight">
                      {pkg.price}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-brown uppercase tracking-wider">
                    Template Benefits:
                  </span>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-darkBrown flex items-start gap-2.5 leading-snug"
                      >
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-taupe/20 text-brown flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Template Mock Actions */}
              <div className="mt-6 pt-4 border-t border-taupe/20 space-y-2">
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Viewing template: ${pkg.name}`);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-offWhite text-darkBrown hover:bg-taupe/20 font-semibold transition-colors flex items-center justify-center gap-1 border border-taupe/20"
                  >
                    <Eye className="w-3 h-3 text-brown" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Editing template: ${pkg.name}`);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-offWhite text-darkBrown hover:bg-taupe/20 font-semibold transition-colors flex items-center justify-center gap-1 border border-taupe/20"
                  >
                    <Edit className="w-3 h-3 text-brown" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Duplicated template: ${pkg.name}`);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-offWhite text-darkBrown hover:bg-taupe/20 font-semibold transition-colors flex items-center justify-center gap-1 border border-taupe/20"
                  >
                    <Copy className="w-3 h-3 text-brown" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Disabled template: ${pkg.name}`);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-offWhite text-darkBrown hover:bg-taupe/20 font-semibold transition-colors flex items-center justify-center gap-1 border border-taupe/20"
                  >
                    <Power className="w-3 h-3 text-brown" />
                    <span>Disable</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
