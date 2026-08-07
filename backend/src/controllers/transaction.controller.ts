import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";

export async function createTransaction(
  req: Request,
  res: Response
) {
  try {
    const transaction =
      await transactionService.createTransaction(
        req.params.id,
        req.body
      );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create transaction",
    });
  }
}

export async function getCustomerTransactions(
  req: Request,
  res: Response
) {
  try {
    const transactions =
      await transactionService.getCustomerTransactions(req.params.id);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
}


