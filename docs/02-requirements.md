# Bille

# Software Requirements Specification (SRS)

Version: 0.1

---

# Functional Requirements

## FR-1 Dashboard

The system shall provide a dashboard displaying:

- Total customers
- Total outstanding balance
- Total amount collected
- Number of active customers
- Recent transactions

---

## FR-2 Customer Management

The system shall allow users to:

- Create a customer
- View customer details
- Edit customer information
- Delete customer
- Search customers

Each customer shall have:

- Name
- Phone Number
- Address (Optional)
- Notes (Optional)
- Created Date

---

## FR-3 Customer Account

Each customer shall have an account containing:

- Current Balance
- Total Charges
- Total Payments
- Transaction History

---

## FR-4 Add Charge

The system shall allow users to increase a customer's balance.

A charge shall contain:

- Amount
- Description
- Date
- Notes (Optional)

The customer's balance shall automatically increase.

---

## FR-5 Record Payment

The system shall allow users to record payments.

A payment shall contain:

- Amount
- Date
- Payment Method
- Notes (Optional)

The customer's balance shall automatically decrease.

---

## FR-6 Transactions

Every financial activity shall create a transaction record.

Transaction types include:

- Charge
- Payment
- Adjustment

Each transaction shall store:

- Date
- Amount
- Description
- Type

Note: an earlier draft of this requirement listed "User action" as a
separate stored field. This is satisfied without a dedicated field —
each transaction's `type` (Charge/Payment/Adjustment) combined with
its `created_at`, `updated_at`, and `deleted_at` timestamps (see
05 Database Design) already records what happened and when, fulfilling
the Auditability NFR below without duplicating data.

---

## FR-7 Transaction History

The system shall display all customer transactions in chronological order.

Each transaction shall display:

- Date
- Type
- Amount
- Balance After Transaction

---

## FR-8 Reports

The system shall generate:

- Customer Statement
- Daily Collection Report
- Monthly Collection Report
- Outstanding Balance Report

---

## FR-9 Share

The system shall allow users to share customer statements.

Supported formats:

- PDF
- Image
- Text Summary

---

## FR-10 Deleted Transactions

Deleted transactions shall not be permanently removed.

Instead they shall:

- Move to Trash
- Be Restorable
- Record deletion date

---

## FR-11 Backup

The system shall allow:

- Manual Backup
- Restore Backup

Cloud backup may be added in future versions.

---

# Non-Functional Requirements

## Performance

- Customer search shall complete in less than 1 second.
- Balance calculations shall be immediate.

---

## Reliability

- No transaction shall be lost.
- Backup shall restore all customer data correctly.

---

## Usability

The application shall be simple enough that a first-time user can:

- Create a customer
- Add a charge
- Record a payment

without training.

---

## Security

The application shall support:

- PIN Lock (Future)
- Fingerprint Authentication (Future)

---

## Availability

The application shall function without an internet connection.

---

## Data Integrity

The system shall always calculate balances automatically.

Manual balance editing shall not be allowed.

---

## Auditability

Every financial action shall be recorded in transaction history.