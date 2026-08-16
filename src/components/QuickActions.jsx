import React from "react";
import { PlusCircle, PackagePlus, PlusSquare, FileCheck2, Zap } from "lucide-react";

export default function QuickActions({ onActionSelect }) {
  const actions = [
    {
      id: "add_sponsorship",
      label: "+ Add Sponsorship",
      description: "Register monetary, in-kind, or digital deal",
      icon: PlusCircle,
    },
    {
      id: "create_package",
      label: "+ Create Package",
      description: "Define reusable partnership template",
      icon: PackagePlus,
    },
    {
      id: "add_deliverable",
      label: "+ Add Deliverable",
      description: "Assign promised committee benefit",
      icon: PlusSquare,
    },
    {
      id: "view_approvals",
      label: "View Pending Approvals",
      description: "Review faculty & sponsor sign-offs",
      icon: FileCheck2,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-taupe/30 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-taupe/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-taupe/20 text-brown flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-espresso tracking-tight">
              Quick Actions
            </h2>
            <p className="text-xs text-brown">Committee operations hub</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionSelect(action.id)}
              className="group p-3.5 rounded-xl bg-offWhite/50 hover:bg-espresso text-left border border-taupe/20 hover:border-espresso transition-all duration-200 flex items-start gap-3 shadow-2xs hover:-translate-y-0.5"
            >
              <div className="p-2 rounded-lg bg-taupe/20 text-brown group-hover:bg-taupe group-hover:text-espresso transition-colors shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-espresso group-hover:text-offWhite transition-colors">
                  {action.label}
                </p>
                <p className="text-[10px] text-brown group-hover:text-taupe transition-colors">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
