# SponsorFlow
## Experiment 1 — Responsive & Interactive UI using React and Tailwind CSS

SponsorFlow is a comprehensive dashboard platform used by college committees to organize and track event sponsorships, sponsorship packages, promised deliverables, sponsor approvals, and overall sponsorship progress.

---

### Features Implemented for Experiment 1
- **Responsive Dashboard Layout**: Custom responsive breakdown across Desktop (Sidebar + Topbar + Grid), Tablet (Compact Sidebar + 2-col Grid), and Mobile (Collapsible Hamburger Drawer + Stacked Cards).
- **Strict Espresso & Taupe Palette**: Designed using strict theme values (`#26150B` Deep Espresso, `#403022` Dark Brown, `#735840` Medium Brown, `#A68D77` Beige/Taupe, `#DBDDD8` Off White).
- **Sponsorship Packages**: Tiered offerings (Silver ₹25,000, Gold ₹50,000 - Most Popular, Title ₹1,00,000) with interactive selection state highlighting.
- **Sponsor Overview**: Detailed sponsor tracking table with customized taupe/beige status badges (`Approved`, `Pending`, `Under Review`, `Negotiating`) and responsive mobile card fallbacks.
- **Deliverable Tracking & Interactive Modal**: Promised deliverables grid with an interactive modal displaying detailed specs, assigned committee team, deadlines, and a mock proof artifact viewer.
- **Hero & Event Overview**: Live tracking for **CSI TechNext 2026** featuring ₹2,45,000 raised against a ₹4,00,000 goal (61% progress bar).
- **Responsive Topbar & Quick Actions**: Search bar, notification bell dropdown with unread counters, mock user profile dropdown (`Neel Kalekar - Committee Head`), and quick action form dialogs.

---

### Quick Start Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build Application**:
   ```bash
   npm run build
   ```
