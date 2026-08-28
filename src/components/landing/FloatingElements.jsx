import React from "react";
import { MessageSquare, Mail, FileSpreadsheet, Clock, AlertCircle, StickyNote as StickyNoteIcon, Smartphone } from "lucide-react";

/**
 * Reusable floating communication cards representing scattered sponsorship workflow.
 * Styled dynamically with CSS variables for Light & Dark mode.
 */

export function WhatsAppCard({ text = "Hey, did we contact NovaAI?", time = "11:42 AM", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--text-primary)] backdrop-blur-md p-3.5 rounded-2xl border border-[var(--border-strong)] shadow-xl space-y-1.5 max-w-xs ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[10px] text-[var(--brand-royal)] font-mono font-semibold">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-[var(--brand-royal)]" />
          Committee WhatsApp
        </span>
        <span>{time}</span>
      </div>
      <p className="text-xs font-sans-ui font-medium text-[var(--text-primary)] leading-snug">{text}</p>
      <div className="flex justify-end text-[9px] text-[var(--text-muted)] font-semibold">✓✓ Seen</div>
    </div>
  );
}

export function EmailCard({ subject = "Sponsorship Proposal — Follow Up", from = "committee@vesit.edu", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--text-primary)] backdrop-blur-md p-3.5 rounded-2xl border border-[var(--border-strong)] shadow-xl space-y-1.5 max-w-xs ${className}`}>
      <div className="flex items-center justify-between text-[10px] text-[var(--brand-royal)] font-mono font-semibold">
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3 text-[var(--brand-royal)]" />
          Inbox (Unread)
        </span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border border-[var(--accent-pink)]/30 font-bold">Followup</span>
      </div>
      <p className="text-xs font-sans-ui font-bold text-[var(--text-primary)] truncate">{subject}</p>
      <p className="text-[10px] font-sans-ui text-[var(--text-secondary)] truncate">From: {from}</p>
    </div>
  );
}

export function SpreadsheetCard({ title = "SPONSOR_LIST_FINAL_v3.xlsx", status = "Missing Data", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--text-primary)] backdrop-blur-md p-3.5 rounded-2xl border border-[var(--border-strong)] shadow-xl space-y-2 max-w-xs ${className}`}>
      <div className="flex items-center justify-between text-[10px] text-[var(--brand-royal)] font-mono font-semibold">
        <span className="flex items-center gap-1">
          <FileSpreadsheet className="w-3 h-3 text-[var(--brand-royal)]" />
          Excel Sheet
        </span>
        <span className="text-[9px] text-[var(--accent-pink)] font-bold bg-[var(--accent-pink-bg)] px-1.5 py-0.5 rounded border border-[var(--accent-pink)]/30">{status}</span>
      </div>
      <p className="text-xs font-sans-ui font-bold text-[var(--text-primary)] truncate">{title}</p>
      <div className="grid grid-cols-3 gap-1 text-[9px] text-[var(--text-secondary)] font-mono bg-[var(--bg-surface-alt)] p-1.5 rounded-lg border border-[var(--border-subtle)]">
        <span className="truncate">NovaAI</span>
        <span className="truncate">₹50k</span>
        <span className="text-[var(--accent-pink)] font-bold">???</span>
      </div>
    </div>
  );
}

export function ContactCard({ name = "Last contacted: 2 years ago", status = "Unknown Status", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--text-primary)] backdrop-blur-md p-3 rounded-2xl border border-[var(--border-strong)] shadow-xl flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-alt)] text-[var(--brand-royal)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--border-subtle)]">
        <Clock className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-sans-ui font-bold text-[var(--text-primary)] truncate">{name}</p>
        <p className="text-[10px] font-sans-ui text-[var(--text-secondary)] truncate">{status}</p>
      </div>
    </div>
  );
}

export function UnreadBadge({ count = "17 Unread Messages", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--accent-pink)] px-3 py-1.5 rounded-full border border-[var(--accent-pink)]/40 shadow-lg text-[11px] font-mono font-bold flex items-center gap-1.5 ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 text-[var(--accent-pink)] animate-pulse" />
      <span>{count}</span>
    </div>
  );
}

export function StickyNote({ text = "Who sponsored us last year?", className = "" }) {
  return (
    <div className={`bg-[var(--bg-surface-alt)] text-[var(--text-primary)] p-3 rounded-xl border border-[var(--border-strong)] shadow-lg font-mono text-xs font-semibold max-w-xs ${className}`}>
      <div className="flex items-center gap-1 text-[10px] text-[var(--brand-royal)] mb-1 font-sans-ui">
        <StickyNoteIcon className="w-3 h-3 text-[var(--brand-royal)]" />
        Desk Note
      </div>
      <p className="leading-snug">"{text}"</p>
    </div>
  );
}

export function DmCard({ platform = "Instagram DM", text = "Seen 3 weeks ago", className = "" }) {
  return (
    <div className={`bg-[var(--bg-card)] text-[var(--text-primary)] p-3 rounded-2xl border border-[var(--border-strong)] shadow-xl space-y-1 ${className}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--brand-royal)]">
        <Smartphone className="w-3 h-3" />
        {platform}
      </div>
      <p className="text-xs font-sans-ui font-semibold text-[var(--text-primary)]">{text}</p>
    </div>
  );
}
