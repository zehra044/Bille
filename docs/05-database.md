# Bille
# Database Design
Version: 0.1

---

# Customer

Represents a person who has a financial account.

| Field | Type | Purpose |
|---|---|---|
| id | UUID | Primary key. UUID (not auto-increment integer) so records won't collide if cloud sync is added in a future version |
| full_name | text | |
| phone_number | text | |
| address | text (optional) | |
| notes | text (optional) | |
| created_at | timestamp | When the record was made |
| updated_at | timestamp | When it was last changed |
| is_archived | boolean | Soft-delete flag — set true when a customer is moved to Trash (per BR-10) |
| is_backed_up | boolean | Tracks whether this record has been included in the most recent export/backup |

---

# Transaction

| Field | Type | Purpose |
|---|---|---|
| id | UUID | Primary key |
| customer_id | UUID (FK → Customer.id) | |
| type | enum: CHARGE, PAYMENT, ADJUSTMENT | See Type, below |
| amount | decimal | Always stored as a positive number; the sign of its effect on balance is determined by `type` |
| description | text | Used for Charges (per FR-4) |
| payment_method | text (required for Payment, otherwise null) | e.g. Cash, Mobile money, Bank transfer — see 07/08 for how this is entered |
| reason | text (required for Adjustment, otherwise null) | Enforced at the logic layer per the mandatory-reason decision (06 API Design) |
| notes | text (optional, all types) | |
| date | date | The transaction date as entered/edited by the user — distinct from `created_at`. Reports and history are ordered and filtered by this field, not `created_at`, so backdated entries land correctly (per 09 Backend) |
| created_at | timestamp | When the record was made |
| updated_at | timestamp | When it was last changed (including edits, per BR-7) |
| deleted_at | timestamp (nullable) | Soft-delete marker. Null = active; non-null = in Trash. This is the single source of truth for deletion — see note below |
| is_backed_up | boolean | Tracks whether this record has been included in the most recent export/backup |

## Type

Only three values:

- CHARGE
- PAYMENT
- ADJUSTMENT

## Note on soft delete

A transaction's `deleted_at` timestamp is the only mechanism needed to
represent "this transaction is in Trash" — it doubles as both the flag
(non-null = deleted) and the deletion date (FR-10 requirement to
"record deletion date"). A separate "Deleted Transaction" table is not
used, since it would just duplicate what `deleted_at` already
expresses, and this app has no multi-user attribution to track (single
collector, per the confirmed architecture decision), so a `deleted_by`
field would be meaningless.

---

# Settings

| Field | Type | Purpose |
|---|---|---|
| business_name | text (optional) | Shown on exported statements/reports |
| currency | text | e.g. "USD", "SOS" — determines the currency symbol/format used throughout the app, including reports and statements |
| theme | text | Reserved for future use (e.g. light/dark) — not required for V0.1 per 08 UI Design |

---

# Entity relationship

```
+------------------+
|    Customer      |
+------------------+
| id (UUID, PK)    |
| full_name        |
| phone_number     |
| address          |
| notes            |
| created_at       |
| updated_at       |
| is_archived      |
| is_backed_up     |
+------------------+
          │
          │ 1
          │
          │ ∞
+--------------------+
|    Transaction     |
+--------------------+
| id (UUID, PK)      |
| customer_id (FK)   |
| type               |
| amount             |
| description        |
| payment_method     |
| reason             |
| notes              |
| date               |
| created_at         |
| updated_at         |
| deleted_at         |
| is_backed_up       |
+--------------------+
```

---

# Design notes for future sync (not implemented in V0.1)

- UUID primary keys avoid collisions if records from multiple devices
  are ever merged (cloud sync, V2).
- `created_at` / `updated_at` on every table give a natural
  "everything changed since X" query for a future sync mechanism.
- `is_backed_up` supports the manual export/backup feature now, and
  could be repurposed as a sync-status flag later.