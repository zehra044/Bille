import assert from "node:assert/strict";
import test from "node:test";
import { TransactionType } from "@prisma/client";
import { assertNonNegativeBalance, calculateSummary } from "../src/services/ledger.service";

const date = (day: number) => new Date(`2026-08-${String(day).padStart(2, "0")}T12:00:00.000Z`);

test("summarizes charges, payments, and signed adjustments", () => {
  const summary = calculateSummary([
    { type: TransactionType.CHARGE, amount: 100, date: date(1) },
    { type: TransactionType.PAYMENT, amount: 30, date: date(2) },
    { type: TransactionType.ADJUSTMENT, amount: -10, date: date(3) },
    { type: TransactionType.ADJUSTMENT, amount: 5, date: date(4) },
  ]);

  assert.deepEqual(summary, {
    totalCharges: 100,
    totalPayments: 30,
    totalAdjustments: -5,
    balance: 65,
  });
});

test("allows a payment when the earlier charge covers it", () => {
  assert.doesNotThrow(() => assertNonNegativeBalance([
    { type: TransactionType.CHARGE, amount: 100, date: date(1) },
    { type: TransactionType.PAYMENT, amount: 100, date: date(2) },
  ]));
});

test("rejects a payment larger than the balance", () => {
  assert.throws(
    () => assertNonNegativeBalance([
      { type: TransactionType.CHARGE, amount: 100, date: date(1) },
      { type: TransactionType.PAYMENT, amount: 101, date: date(2) },
    ]),
    /negative/,
  );
});

test("rejects a backdated payment that would make history invalid", () => {
  assert.throws(
    () => assertNonNegativeBalance([
      { type: TransactionType.CHARGE, amount: 100, date: date(2) },
      { type: TransactionType.PAYMENT, amount: 20, date: date(1) },
    ]),
    /negative/,
  );
});

test("uses creation time to order a charge and payment entered on the same day", () => {
  assert.doesNotThrow(() => assertNonNegativeBalance([
    { type: TransactionType.CHARGE, amount: 100, date: date(1), createdAt: new Date("2026-08-01T08:00:00Z") },
    { type: TransactionType.PAYMENT, amount: 100, date: date(1), createdAt: new Date("2026-08-01T09:00:00Z") },
  ]));
});
