import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { validate } from "../middleware/validate";
import { createTransactionSchema } from "../validations/transaction.validation";

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

router.get("/:id/transactions", transactionController.getCustomerTransactions);


export default router;
