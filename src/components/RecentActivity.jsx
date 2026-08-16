import React from "react";
import { Activity, Clock, CheckCircle2, FileUp, Sparkles } from "lucide-react";
import { recentActivities } from "../data/mockData";

export default function RecentActivity() {
  const getActivityIcon = (type) => {
    switch (type) {
      case "approval":
        return <CheckCircle2 className="w-3.5 h-3.5 text-espresso" />;
      case "submission":
        return <FileUp className="w-3.5 h-3.5 text-brown" />;
      case "status":
        return <Clock className="w-3.5 h-3.5 text-brown" />;
      case "faculty":
        return <Sparkles className="w-3.5 h-3.5 text-espresso" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-brown" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-taupe/30 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-taupe/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-taupe/20 text-brown flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-espresso tracking-tight">
              Recent Activity
            </h2>
            <p className="text-xs text-brown">Real-time sponsorship audit log</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-brown uppercase bg-offWhite px-2.5 py-1 rounded-full border border-taupe/20">
          Live Feed
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-taupe/30">
        {recentActivities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-offWhite border-2 border-taupe text-brown flex items-center justify-center group-hover:bg-taupe transition-colors">
              {getActivityIcon(act.type)}
            </div>

            <div className="bg-offWhite/40 hover:bg-offWhite/80 p-3 rounded-xl border border-taupe/20 transition-colors">
              <p className="text-xs font-semibold text-darkBrown leading-snug">
                {act.text}
              </p>
              <span className="text-[10px] text-brown font-medium mt-1 inline-block">
                {act.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
