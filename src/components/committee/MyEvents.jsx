import React from "react";
import { Calendar, MapPin, Users, Edit, Eye, Plus } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { committeeEvents } from "../../data/mockData";

export default function MyEvents() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-taupe/30 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-espresso tracking-tight">My Events</h2>
          <p className="text-xs text-brown mt-1">Manage your committee events and sponsorship requirements</p>
        </div>
        <button
          onClick={() => alert("Create Event form (Mock)")}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-taupe" />
          Create Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {committeeEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-taupe/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Event Header */}
            <div className="bg-espresso p-5 text-offWhite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{event.name}</h3>
                  <p className="text-xs text-taupe mt-0.5">{event.type}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-darkBrown leading-relaxed">{event.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-brown bg-offWhite/50 px-3 py-2 rounded-lg border border-taupe/15">
                  <Calendar className="w-4 h-4 text-taupe shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brown bg-offWhite/50 px-3 py-2 rounded-lg border border-taupe/15">
                  <MapPin className="w-4 h-4 text-taupe shrink-0" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brown bg-offWhite/50 px-3 py-2 rounded-lg border border-taupe/15">
                  <Users className="w-4 h-4 text-taupe shrink-0" />
                  <span>{event.participants} Participants</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brown bg-offWhite/50 px-3 py-2 rounded-lg border border-taupe/15">
                  <span className="text-[10px] font-bold text-espresso">{event.totalSponsors} Sponsors</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brown uppercase">Sponsorship:</span>
                <StatusBadge status={event.sponsorshipStatus} />
              </div>

              <div className="flex gap-2 pt-2 border-t border-taupe/20">
                <button
                  onClick={() => alert(`Viewing event: ${event.name}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-espresso bg-offWhite hover:bg-taupe/20 border border-taupe/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => alert(`Editing event: ${event.name}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-espresso text-offWhite hover:bg-darkBrown transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
