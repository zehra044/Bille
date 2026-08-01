# Bille

# Business Rules

Version: 0.1

---

# BR-1 Customer Creation

A newly created customer shall have a balance of 0.

No initial balance is entered during customer creation.

---

# BR-2 Balance Calculation

Customer balances shall never be entered manually.

The system shall calculate the balance automatically.

Formula:

Current Balance =
Total Charges - Total Payments + Adjustments

---

# BR-3 Charges

Adding a charge shall immediately increase the customer's balance.

Every charge shall create a transaction record.

---

# BR-4 Payments

Recording a payment shall immediately decrease the customer's balance.

Every payment shall create a transaction record.

---

# BR-5 Payment Validation

A payment cannot be greater than the customer's current balance.

If the payment exceeds the balance, the system shall reject the operation and display an error message.

---

# BR-6 Negative Balance

Customer balances shall never become negative.

---

# BR-7 Transaction Editing

Transactions may be edited.

Whenever a transaction is edited, the customer's balance shall be recalculated automatically.

---

# BR-8 Transaction Deletion

Deleting a transaction shall not permanently remove it.

Deleted transactions shall be moved to the Trash.

---

# BR-9 Restoring Transactions

Restoring a transaction from the Trash shall automatically recalculate the customer's balance.

---

# BR-10 Customer Deletion

A customer may be deleted (soft delete, moved to Trash) regardless of
transaction history.

If the customer's current balance is not zero, the system shall warn
the user before proceeding:

"This customer has an outstanding balance of [amount]. Delete anyway?"

The user may cancel or confirm. If confirmed, the customer is moved to
Trash and is restorable, per BR-8 and the Trash rules defined in
06 API Design.

If the customer's balance is zero, deletion proceeds without a
warning.

---

# BR-11 Transaction History

Every charge and payment shall be stored permanently unless moved to Trash.

Transaction history shall be displayed in chronological order.

---

# BR-12 Reports

Reports shall always be generated from transaction history.

Reports shall never use manually entered balances.

---

# BR-13 Backup

A backup shall include:

- Customers
- Transactions
- Deleted Transactions
- Settings

Restoring a backup shall restore all application data.

---

# BR-14 Offline Mode

The application shall function without an internet connection.

All data shall be stored locally in Version 0.1.

---

# Architecture Decision: Offline First

Bille V0.1 stores all data locally (SQLite) and works fully without
internet. This suits the confirmed single-collector use case and
avoids the complexity of login and multi-device sync for the initial
version.

**Backup rule:** Because payment records are critical financial data,
the app must provide a manual export feature (export to file, or share
via WhatsApp, email, etc.) in V0.1. This is not optional — it protects
the collector against data loss from a lost, broken, or reset phone.