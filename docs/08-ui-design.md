# Bille
# UI Design
Version: 0.1

This document defines the visual style for Bille and applies it to each
screen from **07 Wireframes**. It's meant to be handed to whoever builds
the Mobile app next — the actual framework/component choices happen in
that phase.

---

## Style direction

**Overall feel:** Clean and minimal. Lots of white space, simple layouts,
nothing decorative. The app should feel calm and trustworthy — this is
where someone tracks money they're owed.

### Color

| Role | Color | Used for |
|---|---|---|
| Primary / brand | Green | Balance figures, "Collected" stat, primary action buttons (e.g. "+ Charge") |
| Outstanding / owed | Soft coral (not red) | "Outstanding" stat, unpaid balance indicators — deliberately softer than red so it doesn't read as alarming for everyday use |
| Neutral | Gray / white surfaces | Backgrounds, cards, secondary buttons, dividers |
| Danger | Red | Reserved only for destructive actions (delete, empty trash) — not for balances |

**Rule:** only one filled/primary button per screen. Secondary actions
use an outlined or plain style. This keeps each screen's main action
obvious.

### Typography

- One sans-serif typeface throughout.
- Two weights only: regular (body text) and medium (headings, labels,
  numbers that matter — like balance amounts).
- Sentence case everywhere — no ALL CAPS, no Title Case (except proper
  nouns like "Bille").

### Layout

- Cards with soft rounded corners (12–16px) group related info —
  e.g. the four dashboard stats, or the balance block on Customer
  Detail.
- Generous padding — nothing should feel cramped.
- Bottom tab bar for primary navigation: **Home, Customers, Reports,
  Settings.**

### Tone of voice (for button/label copy)

- Verb-first, short: "Add charge", "Record payment", "Export backup" —
  not "Charge Entry Form" or "Submit".
- No exclamation points, no "please," no "successfully" in
  confirmations — e.g. "Payment recorded," not "Payment recorded
  successfully!"

---

## Screens

### 1. Dashboard
- Four stat cards in a 2×2 grid: Outstanding (coral), Collected
  (green), Customers, Active.
- "Recent transactions" list below, most recent first.
- Bottom tab bar, Home tab active.

### 2. Customer list
- Search bar at top.
- Each row: customer name + current balance.
- Floating "+" button (green) to add a new customer.

### 3. Customer detail
- Back arrow + customer name at top.
- Balance shown in a large, centered green card.
- Two action buttons side by side: "+ Charge" (primary, filled green)
  and "+ Payment" (secondary, outlined).
- Transaction history below, most recent first, showing date, type,
  and running balance.
- "Share statement" link at the bottom.

### 4. Add charge / record payment
- Simple form: Amount, Date, Description or Payment method, Notes
  (optional).
- Single filled "Save" button at the bottom.
- Adjustment form (not shown separately) follows the same layout, with
  "Reason" as a required field.

### 5. Trash
- List of deleted items (customers and transactions), each with a
  restore icon.
- "Empty trash" as a plain (not filled) red-text action at the bottom
  — destructive, so it's visually quiet until tapped, then confirms
  before acting.

### 6. Reports
- Simple menu of report types (Customer statement, Daily collection,
  Monthly collection, Outstanding balance).
- Each report opens as a list + total, with a "Share report" action.

### 7. Delete customer — warning dialog
- Shown only when balance ≠ 0.
- Plain text warning, two buttons: "Cancel" (secondary) and "Delete"
  (danger red, since this is destructive even though it's a soft
  delete).

### 8. Settings (Backup and restore, plus business settings)
- "Last backup" date shown at top.
- Two actions: "Export backup" (primary) and "Restore backup"
  (secondary).
- "Cloud backup — coming soon" shown as muted, disabled text (V2
  placeholder).
- Business name and currency fields (from the Settings table, 05
  Database Design) live on this same screen — simple text fields,
  edited directly. Currency is used to format every amount shown in
  Reports and Customer Statements.

---

## Open decisions for the Mobile phase

- Confirm bottom tab bar vs. other navigation pattern once a framework
  is chosen.
- Dark mode support (not addressed here — recommend deferring to
  Mobile phase unless required for V0.1).