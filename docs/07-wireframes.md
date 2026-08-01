# Bille
# Wireframes
Version: 0.1

Low-fidelity wireframes for the core screens, covering the main flow:
Dashboard → Customer List → Customer Detail → Add Charge/Payment → Trash.

These are structural sketches (layout and content only) — visual styling
is decided later in **UI Design**.

---

## 1. Dashboard (FR-1)

```
┌─────────────────────────────┐
│  Bille                      │
├─────────────────────────────┤
│  ┌───────────┐ ┌───────────┐│
│  │ Customers │ │Outstanding││
│  │    24     │ │   $860    ││
│  └───────────┘ └───────────┘│
│  ┌───────────┐ ┌───────────┐│
│  │ Collected │ │  Active   ││
│  │  $2,140   │ │    19     ││
│  └───────────┘ └───────────┘│
│                              │
│  Recent transactions         │
│  ─────────────────────────  │
│  Amina Yusuf   +$50 payment │
│  Hodan Ali     +$20 charge  │
│  Farah Nur     +$15 payment │
│                              │
└─────────────────────────────┘
```

**Notes**
- Four summary tiles map directly to FR-1: total customers, total
  outstanding balance, total collected, active customer count.
- Recent transactions list below, most recent first.

---

## 2. Customer List (FR-2)

```
┌─────────────────────────────┐
│  Customers                  │
├─────────────────────────────┤
│  🔍 Search customers        
│  ─────────────────────────  │
│  Amina Yusuf         $120   │
│  Hodan Ali            $45   │
│  Farah Nur              $0  │
│  ...                         │
│                              │
│                        (+)  │ ← Add customer
└─────────────────────────────┘
```

**Notes**
- Search bar at top; must return results in <1s per NFR-Performance.
- Each row shows name + current balance.
- Floating "+" opens `createCustomer`.

---

## 3. Customer Detail (FR-3, FR-7)

```
┌─────────────────────────────┐
│  ← Amina Yusuf               │
├─────────────────────────────┤
│  Balance: $120               │
│                              │
│  [ + Charge ]  [ + Payment ] │
│                              │
│  Transaction history         │
│  ─────────────────────────  │
│  Jul 28  Payment  -$50  $120 │
│  Jul 20  Charge   +$70  $170 │
│  Jul 10  Payment  -$30  $100 │
│                              │
│  [ Share statement ]         │
└─────────────────────────────┘
```

**Notes**
- Balance is display-only — no edit control anywhere on this screen
  (Data Integrity rule: balance changes only via Charge/Payment/
  Adjustment).
- History shows date, type, amount, and balance after each transaction
  (FR-7).
- "Share statement" triggers `exportStatement` (FR-9).

---

## 4. Add Charge / Record Payment (FR-4, FR-5)

```
┌─────────────────────────────┐
│  ← Add charge                │
├─────────────────────────────┤
│  Amount        [ $        ] │
│  Date          [ Jul 31    ]│
│  Description   [           ]│
│  Notes (opt.)  [           ]│
│                              │
│              [   Save    ]  │
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  ← Record payment            │
├─────────────────────────────┤
│  Amount        [ $        ] │
│  Date          [ Jul 31    ]│
│  Payment method[ Cash    ▾ ]│
│  Notes (opt.)  [           ]│
│                              │
│              [   Save    ]  │
└─────────────────────────────┘
```

**Notes**
- Same form shape for both; fields differ slightly (Charge has
  description, Payment has payment method).
- Adjustment form (not shown) follows the same pattern but makes
  "Reason" a required field, per the earlier decision.

---

## 5. Trash (FR-10)

```
┌─────────────────────────────┐
│  Trash                       │
├─────────────────────────────┤
│  Deleted charge  $30    ↺   │
│  Deleted customer       ↺   │
│  ...                         │
│                              │
│         [ Empty trash ]      │
└─────────────────────────────┘
```

**Notes**
- Items stay here indefinitely — no auto-purge (per decision).
- ↺ restores an individual item (`restoreTransaction` /
  restore customer).
- "Empty trash" permanently deletes everything — must be confirmed
  before calling `emptyTrash`.

---

## 6. Reports (FR-8)

```
┌─────────────────────────────┐
│  Reports                     │
├─────────────────────────────┤
│  [ Customer statement    ]  │
│  [ Daily collection      ]  │
│  [ Monthly collection    ]  │
│  [ Outstanding balance   ]  │
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  ← Outstanding balance        │
├─────────────────────────────┤
│  Amina Yusuf         $120   │
│  Hodan Ali            $45   │
│  ...                         │
│  ─────────────────────────  │
│  Total outstanding:  $860    │
│                              │
│  [ Share report ]             │
└─────────────────────────────┘
```

**Notes**
- Reports screen is a simple menu; each option opens its own report
  view (list is illustrative — Customer Statement, Daily/Monthly
  Collection follow a similar layout: a list plus a total, with a
  share action).
- "Share report" reuses `exportStatement`-style export (PDF / Image /
  Text), same as customer statements.

---

## 7. Delete customer — warning dialog

```
┌─────────────────────────────┐
│                              │
│   ⚠ Outstanding balance       │
│                              │
│   Amina Yusuf has an         │
│   outstanding balance of     │
│   $120. Delete anyway?       │
│                              │
│   [ Cancel ]   [ Delete ]    │
│                              │
└─────────────────────────────┘
```

**Notes**
- Only shown when balance ≠ 0 (per earlier decision: warn but allow).
- If balance = 0, deletion proceeds without this dialog.
- "Delete" moves the customer to Trash (soft delete), not permanent.

---

## 8. Backup / Restore (FR-11)

```
┌─────────────────────────────┐
│  Backup & restore            │
├─────────────────────────────┤
│  Last backup: Jul 28, 2026   │
│                              │
│  [   Export backup    ]      │
│  [   Restore backup   ]      │
│                              │
│  Cloud backup — coming soon  │
└─────────────────────────────┘
```

**Notes**
- "Export backup" calls `exportFullBackup` — saves to file / share
  sheet (WhatsApp, email, Drive, etc.).
- "Restore backup" calls `restoreFromBackup`, prompting the user to
  pick a previously exported file.
- Cloud backup line is a placeholder for V2 — greyed out / disabled
  in V0.1.
