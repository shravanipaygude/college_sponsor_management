import React from "react";
import { Users, IndianRupee, Gift, CheckSquare, Clock } from "lucide-react";
import { statsData } from "../data/mockData";

const iconMap = {
  Users: Users,
  IndianRupee: IndianRupee,
  Gift: Gift,
  CheckSquare: CheckSquare,
  Clock: Clock,
};

export default function StatCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
      {statsData.map((stat) => {
        const IconComponent = iconMap[stat.iconName] || Users;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl p-4 sm:p-5 border border-taupe/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="w-9 h-9 rounded-xl bg-taupe/15 text-brown flex items-center justify-center group-hover:bg-espresso group-hover:text-taupe transition-colors duration-200 shrink-0">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-espresso tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[11px] font-medium text-brown/90 flex items-center gap-1 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-taupe shrink-0" />
                <span>{stat.subtext}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
