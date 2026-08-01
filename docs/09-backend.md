# Bille
# Backend (Local Logic Layer)
Version: 0.1

Bille has no server. "Backend" here means the local logic layer that
sits between the UI and SQLite — it implements every operation defined
in **06 API Design**, enforces the rules from **03 Business Rules**,
and reads/writes the schema from **05 Database Design**.

This document is framework-agnostic (applies whether the Mobile phase
picks Flutter, React Native, or native) — it describes what the logic
layer must do, not which language it's written in.

---

## Responsibilities

The logic layer is the only thing allowed to touch the database
directly. The UI never writes SQL or edits balances itself — it only
calls functions like `addCharge()` or `getDashboardSummary()`.

Three jobs, in order of importance:

1. **Enforce business rules** the UI can't be trusted to enforce alone
   (e.g. balance is never manually editable).
2. **Keep balances correct** after every operation — no drift, no lost
   updates.
3. **Implement the operations from 06 API Design** exactly as
   specified.

---

## Core modules

### 1. Customer module
Implements: `createCustomer`, `getCustomer`, `listCustomers`,
`updateCustomer`, `deleteCustomer`.

- `updateCustomer` must reject any attempt to write directly to the
  `balance` field — balance is a derived value, never a direct write.
- `deleteCustomer` checks current balance before soft-deleting:
  - balance = 0 → delete immediately
  - balance ≠ 0 → logic layer returns a flag so the UI can show the
    warning dialog (07, screen 7); actual deletion only happens after
    UI confirmation calls the operation again with a confirmed flag.

### 2. Transaction module
Implements: `addCharge`, `recordPayment`, `addAdjustment`,
`getTransactionHistory`, `editTransaction`, `deleteTransaction`,
`restoreTransaction`.

- Every one of these operations is a **single atomic step**: write the
  transaction row AND update the customer's balance together, or
  neither happens. This is the most important reliability rule in the
  whole app (per NFR-Reliability: "No transaction shall be lost").
- `addAdjustment` rejects the call if `reason` is empty or missing —
  enforced here, not just in the UI, per the earlier decision that
  Adjustments require a mandatory reason.
- `editTransaction` (per BR-7):
  1. Apply the edited fields (amount, description/reason/payment
     method, date, notes — type itself is never editable).
  2. Recalculate the customer's balance from scratch, the same way as
     after an add/delete/restore (see Balance calculation, below).
  3. Re-run the same validation as on creation — e.g. an edit that
     would make a Payment exceed the customer's balance, or push the
     balance negative, is rejected (BR-5, BR-6) and the original
     values are kept.
  4. Adjustment edits still require a non-empty `reason` — the
     mandatory-reason rule applies on edit, not just on creation.
- `deleteTransaction` (soft delete):
  1. Mark the transaction row as deleted, record deletion timestamp.
  2. Recalculate the customer's balance as if that transaction didn't
     happen.
  3. Never physically remove the row — it must remain restorable
     (FR-10).
- `restoreTransaction` reverses step 1–2 above: un-mark as deleted,
  recalculate balance to include it again.

### 3. Balance calculation
This is the one piece of logic that must be bulletproof, since manual
balance editing is disallowed everywhere else in the app.

- Balance is always **derived**, never stored as a manually-set value:
  `balance = sum(charges) + sum(adjustments) − sum(payments)`,
  counting only non-deleted transactions.
- Recalculate (not just adjust by ±amount) whenever a transaction is
  added, deleted, or restored — recalculating from scratch is slower
  but immune to drift bugs; adjusting incrementally is faster but risks
  small errors compounding over time. For V0.1 data volumes (a single
  collector's customers), recalculating in full is cheap enough to be
  the safer default.

### 4. Trash module
Implements: `listTrash`, `emptyTrash`.

- Lists all soft-deleted customers and transactions together, most
  recently deleted first.
- `emptyTrash` is the only operation in the entire app that performs a
  **hard delete**. It must require explicit confirmation from the
  calling UI layer (not just a button tap — a confirmation dialog) and
  cannot be undone.
- No auto-purge job — nothing runs in the background to clear Trash on
  its own, per the earlier decision.

### 5. Dashboard / summary module
Implements: `getDashboardSummary`.

- Aggregates: total customers, total outstanding balance (sum of
  positive balances only), total collected (sum of payments), active
  customer count (customers with balance > 0), and the N most recent
  transactions.
- Must return in well under 1 second even as data grows — index the
  transactions table on `customer_id` and `date` (see 05 Database
  Design) so this doesn't require scanning every row.

### 6. Reports module
Implements: `getCustomerStatement`, `getDailyCollectionReport`,
`getMonthlyCollectionReport`, `getOutstandingBalanceReport`.

- All reports are read-only queries — they never modify data.
- Date-ranged reports (daily/monthly) filter on the transaction's
  `date` field, not `created_at`, so backdated entries land in the
  right report.
- All monetary amounts in reports and statements are formatted using
  the `currency` value from the Settings table (05 Database Design) —
  e.g. showing "$120" vs "120 SOS" depending on what the collector has
  set. This is the one place `currency` is consumed; it should be read
  once per report generation, not hardcoded.

### 7. Export / backup module
Implements: `exportStatement`, `exportFullBackup`,
`restoreFromBackup`.

- `exportFullBackup` serializes all customers and transactions
  (including soft-deleted ones still in Trash) to a single file, so a
  restore brings back an exact snapshot.
- `restoreFromBackup` should validate the file's structure before
  writing anything — if it's corrupted or from an incompatible
  version, fail with a clear message rather than partially overwriting
  existing data.
- Per NFR-Reliability: "Backup shall restore all customer data
  correctly" — restore should be tested against real exported files as
  part of QA, not assumed to work from code review alone.

---

## Error handling principles

- Every write operation (charge, payment, adjustment, delete, restore)
  either fully succeeds or fully fails — never leaves the transaction
  table and the customer's balance out of sync.
- Validation happens in the logic layer, not just the UI: e.g. negative
  amounts, empty required fields, and missing adjustment reasons are
  rejected here even if a UI bug lets a bad value through.
- Errors returned to the UI should be specific enough to show a useful
  message (e.g. "Amount must be greater than zero") rather than a
  generic failure.

---

## Testing checklist (for whoever implements this)

- [ ] Adding a charge, payment, and adjustment each correctly updates
      the balance.
- [ ] Editing a transaction's amount recalculates the balance
      correctly, and an edit that would violate BR-5/BR-6 is rejected
      with the original values kept.
- [ ] Deleting a transaction recalculates the balance correctly, and
      restoring it brings the balance back exactly.
- [ ] Attempting to delete a customer with balance ≠ 0 triggers the
      warning path rather than deleting silently.
- [ ] Attempting to add an Adjustment with no reason is rejected.
- [ ] Dashboard totals match the sum of all individual customer
      balances.
- [ ] Exporting then restoring a backup produces an identical data
      set (including Trash contents).
- [ ] Emptying Trash permanently removes items and they cannot be
      restored afterward.