# Bille

Project Context
Version: 0.1

---

# Project Overview

Bille is a mobile-first customer ledger application designed for individuals or small businesses who collect money from customers through partial payments.

The app is NOT a membership management system.

Each customer has a financial ledger.

The app keeps the complete history of:

- Charges
- Payments
- Adjustments

The remaining balance is always calculated from the transaction history.

---

# Real World Problem

Example:

Collector adds customer.

Ahmed

Charge:
+100

Ahmed pays

-30

Ahmed pays

-20

Remaining Balance

50

Every payment must remain in history.

Nothing should be overwritten.

---

# Core Principle

Customer
↓

Ledger

↓

Transactions

↓

Balance

↓

Reports

The balance is NEVER stored.

The balance is always calculated.

---

# Current Features

Customer

✓ Create Customer

✓ View Customers

✓ View Customer Details

Transaction

✓ Create Transaction

Supports

- CHARGE
- PAYMENT
- ADJUSTMENT

Validation

✓ Customer Validation

✓ Transaction Validation

Backend

✓ Express

✓ Prisma

✓ PostgreSQL

---

# Planned Features

Customer

- Update Customer
- Archive Customer

Transaction

- Transaction History
- Delete Transaction (Soft Delete)
- Restore Transaction

Ledger

- Remaining Balance
- Total Charges
- Total Payments
- Customer Summary

Reports

- Customer Statement
- Daily Report
- Monthly Report

Sharing

- Share Statement

Backup

- Export Database
- Import Database

Mobile

- React Native

---

# Business Rules

Customer

- Customer can never be permanently deleted.

- Customer with transactions cannot be deleted.

Transactions

- Every transaction belongs to exactly one customer.

- Transaction types

CHARGE

PAYMENT

ADJUSTMENT

- Amount must always be positive.

- PAYMENT subtracts from balance.

- CHARGE adds to balance.

- ADJUSTMENT may increase or decrease depending on reason.

- Deleted transactions are soft deleted.

Balance

Balance is calculated.

Never stored.

---

# Database

Tables

Customer

Transaction

Relationship

Customer

1

↓

∞

Transaction

---

# API

Customers

POST /customers

GET /customers

GET /customers/:id

Transactions

POST /customers/:id/transactions

---

# Backend Architecture

src/

config/

controllers/

middleware/

prisma/

routes/

services/

utils/

validations/

app.ts

server.ts

Architecture

Request

↓

Validation

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL

---

# Technology

Backend

Node.js

Express

TypeScript

Prisma ORM

PostgreSQL

Validation

Zod

Testing

Postman

Mobile

React Native (planned)

---

# Coding Rules

Use Services.

Controllers should remain small.

Business logic belongs in Services.

Validation must happen before Controller.

Never calculate balance manually.

Always calculate from transactions.

Never permanently delete financial records.

Use soft delete.

---

# Development Progress

Planning

100%

Backend Setup

100%

Database

100%

Customer Module

100%

Transaction Module

30%

Balance Engine

0%

Reports

0%

Backup

0%

React Native

0%

---

# Current Goal

Build the Ledger Engine.

Next feature:

GET /customers/:id/summary

Return

- Customer
- Total Charges
- Total Payments
- Remaining Balance

Balance must be calculated from transactions.

Never stored.

---

# Long-Term Vision

Bille should become a simple, fast, reliable customer ledger application for people who collect money from customers every day.

The application should prioritize:

- Simplicity
- Accuracy
- Speed
- Offline-first capability
- Complete financial history
- Easy reporting
