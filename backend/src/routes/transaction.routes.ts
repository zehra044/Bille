import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { validate } from "../middleware/validate";
import { createTransactionSchema, updateTransactionSchema } from "../validations/transaction.validation";

const router = Router();

router.post(
  "/:id/transactions",
  validate(createTransactionSchema),
  transactionController.createTransaction,
);

router.get(
  "/:id/transactions",
  transactionController.getCustomerTransactions
);

router.delete(
  "/:id/transactions/:transactionId",
  transactionController.deleteTransaction,
);

router.patch(
  "/:id/transactions/:transactionId",
  validate(updateTransactionSchema),
  transactionController.updateTransaction,
);

router.post(
  "/:id/transactions/:transactionId/restore",
  transactionController.restoreTransaction,
);

export default router;
