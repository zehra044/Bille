import assert from "node:assert/strict";
import test from "node:test";
import { createTransactionSchema } from "../src/validations/transaction.validation";

const date = "2026-08-07";

test("accepts complete transaction inputs", () => {
  assert.equal(createTransactionSchema.safeParse({
    type: "CHARGE", amount: 100, date, description: "Weekly supply",
  }).success, true);
  assert.equal(createTransactionSchema.safeParse({
    type: "PAYMENT", amount: 50, date, paymentMethod: "Cash",
  }).success, true);
  assert.equal(createTransactionSchema.safeParse({
    type: "ADJUSTMENT", amount: -10, date, reason: "Returned item",
  }).success, true);
});

test("rejects incomplete or invalid transaction inputs", () => {
  assert.equal(createTransactionSchema.safeParse({ type: "CHARGE", amount: 1, date }).success, false);
  assert.equal(createTransactionSchema.safeParse({ type: "PAYMENT", amount: 1, date }).success, false);
  assert.equal(createTransactionSchema.safeParse({ type: "ADJUSTMENT", amount: 0, date, reason: "Correction" }).success, false);
  assert.equal(createTransactionSchema.safeParse({ type: "ADJUSTMENT", amount: 1, date }).success, false);
});
