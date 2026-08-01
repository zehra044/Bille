# Bille

# API Design (Internal Data Layer)

Version: 0.1

Note: Bille is offline-first. "API" here refers to the internal
interface between the UI and the local SQLite database — not a
network API. Each operation below maps to a local function/query.

---

## Entities

- Customer
- Transaction (Charge / Payment / Adjustment)
- Backup/Export

---

## Customer Operations

### createCustomer(name, phone, address?, notes?)

- Creates a new customer record
- Returns: Customer

### getCustomer(customerId)

- Returns full customer profile + current balance

### listCustomers(searchQuery?)

- Returns all customers, optionally filtered by name/phone search
- Must respond in <1s per NFR-Performance

### updateCustomer(customerId, fields)

- Edits name, phone, address, notes only
- Balance is NEVER editable here (Data Integrity rule)

### deleteCustomer(customerId)

- Soft delete — moves to Trash
- If balance ≠ 0: UI must show a warning ("This customer has an
  outstanding balance of X. Delete anyway?") before proceeding
- Deletion is allowed either way once confirmed

---

## Transaction Operations

### addCharge(customerId, amount, description, date, notes?)

- Creates Transaction of type Charge
- Increases customer balance by amount
- Returns updated Transaction + new balance

### recordPayment(customerId, amount, date, paymentMethod, notes?)

- Creates Transaction of type Payment
- Decreases customer balance by amount
- Returns updated Transaction + new balance

### addAdjustment(customerId, amount, reason, date)

- Creates Transaction of type Adjustment
- `reason` is REQUIRED (not optional) — enforced at API level,
  not just UI, since Adjustments exist to correct mistakes and
  need an audit trail
- Adjusts balance by signed amount (+/-)

### getTransactionHistory(customerId)

- Returns all transactions in chronological order
- Each entry includes: date, type, amount, balance after (per FR-7)

### editTransaction(transactionId, fields)

- Edits an existing Charge, Payment, or Adjustment
- Editable fields depend on type:
  - Charge: amount, description, date, notes
  - Payment: amount, date, paymentMethod, notes
  - Adjustment: amount, reason, date
- Type itself cannot be changed (a Charge cannot become a Payment)
- Recalculates the customer's balance after the edit (per BR-7)
- Same validation applies as on creation — e.g. an edited Payment still
  cannot push the balance negative (BR-5, BR-6)
- Returns updated Transaction + new balance

### deleteTransaction(transactionId)

- Soft delete only (per FR-10)
- Moves to Trash, records deletion date
- Recalculates customer balance after removal
- Restorable via restoreTransaction()
- Stays in Trash indefinitely (no auto-purge)

### restoreTransaction(transactionId)

- Restores from Trash
- Recalculates customer balance after restore

---

## Trash Operations

### listTrash()

- Returns all soft-deleted customers and transactions, with deletion date
- No auto-purge — items remain until manually emptied

### emptyTrash(itemId | "all")

- Permanently deletes one item or all items from Trash
- Irreversible — UI must confirm before calling

---

## Dashboard / Summary Operations

### getDashboardSummary()

- Returns: total customers, total outstanding balance,
  total collected, active customer count, recent transactions
  (per FR-1)

---

## Reports

### getCustomerStatement(customerId, dateRange?)

- Returns full statement for one customer

### getDailyCollectionReport(date)

### getMonthlyCollectionReport(month, year)

### getOutstandingBalanceReport()

- Returns list of customers with balance > 0, sorted by amount

---

## Share / Export

### exportStatement(customerId, format)

- format: "PDF" | "Image" | "Text"
- Returns file/content ready to share via OS share sheet

### exportFullBackup()

- Returns full local data export (per FR-11)

### restoreFromBackup(file)

- Restores all customer + transaction data from a backup file
