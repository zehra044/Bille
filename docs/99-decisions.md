# Architecture Decisions

## Decision 001

Balance is NOT stored.

Reason

Avoid inconsistent data.

Balance is calculated from transactions.

Status

Accepted

---

## Decision 002

Use a single Transaction table.

Reason

Charges, Payments and Adjustments are all financial transactions.

Status

Accepted

---

## Decision 003

Soft delete transactions.

Reason

Financial history must never be permanently lost.

Status

Accepted

---

## Decision 004

Backend architecture

Validation

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL

Status

Accepted
