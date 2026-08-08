# Bille API

Base URL: `http://localhost:5000`

All amounts are positive numbers except `ADJUSTMENT`, which may be positive or negative. Balances are calculated from active transactions and are never accepted as input.

## Customers

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/customers` | Create a customer |
| GET | `/customers` | List active customers |
| GET | `/customers/:id` | Customer profile and active transactions |
| GET | `/customers/:id/summary` | Derived customer totals and balance |
| PATCH | `/customers/:id` | Update customer profile fields |
| DELETE | `/customers/:id` | Archive customer; use `?confirm=true` if balance is non-zero |

Create or update customer payload:

```json
{
  "fullName": "Ahmed Ali",
  "phoneNumber": "+252 61 123 4567",
  "address": "Hargeisa",
  "notes": "Prefers mobile money"
}
```

## Transactions

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/customers/:id/transactions` | Create a charge, payment, or adjustment |
| GET | `/customers/:id/transactions` | Active history with `balanceAfter` |
| PATCH | `/customers/:id/transactions/:transactionId` | Edit transaction fields; type cannot change |
| DELETE | `/customers/:id/transactions/:transactionId` | Soft-delete transaction |
| POST | `/customers/:id/transactions/:transactionId/restore` | Restore a deleted transaction |

Charge:

```json
{ "type": "CHARGE", "amount": 100, "date": "2026-08-07", "description": "Weekly supplies" }
```

Payment:

```json
{ "type": "PAYMENT", "amount": 30, "date": "2026-08-07", "paymentMethod": "Cash" }
```

Adjustment:

```json
{ "type": "ADJUSTMENT", "amount": -10, "date": "2026-08-07", "reason": "Returned item" }
```

A transaction that would make the historical balance negative is rejected with `400` (create/edit) or `409` (delete/restore).

## Dashboard, reports, and trash

| Method | Endpoint |
| --- | --- |
| GET | `/dashboard` |
| GET | `/reports/customers/:id/statement` |
| GET | `/reports/daily-collections?date=YYYY-MM-DD` |
| GET | `/reports/monthly-collections?year=YYYY&month=1-12` |
| GET | `/reports/outstanding-balances` |
| GET | `/trash` |
| DELETE | `/trash/transactions/:id?confirm=true` |
| DELETE | `/trash/customers/:id?confirm=true` |
| GET | `/backup/export` |
| POST | `/backup/restore` |

The two Trash delete endpoints are irreversible and require `confirm=true`.

`GET /backup/export` downloads a versioned JSON snapshot containing active and deleted records. Restoring replaces the database contents only when the request body includes `{ "confirm": true, "backup": { ... } }`; the full file is validated before any database write occurs.
