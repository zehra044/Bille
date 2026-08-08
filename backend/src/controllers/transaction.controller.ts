import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";

export async function createTransaction(
  req: Request,
  res: Response
) {
  try {
    const customerId = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!customerId) return res.status(400).json({ message: "Customer id is required" });
    const transaction =
      await transactionService.createTransaction(
        customerId,
        req.body
      );

    res.status(201).json(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create transaction";
    if (message === "Customer not found") {
      return res.status(404).json({ message });
    }
    if (message === "This transaction would make the customer's balance negative") {
      return res.status(400).json({ message });
    }
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
    const customerId = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!customerId) return res.status(400).json({ message: "Customer id is required" });
    const transactions =
      await transactionService.getCustomerTransactions(customerId);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
}

function routeIds(req: Request) {
  const customerId = typeof req.params.id === "string" ? req.params.id : undefined;
  const transactionId = typeof req.params.transactionId === "string"
    ? req.params.transactionId
    : undefined;
  return { customerId, transactionId };
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const { customerId, transactionId } = routeIds(req);
    if (!customerId || !transactionId) {
      return res.status(400).json({ message: "Customer and transaction ids are required" });
    }
    const transaction = await transactionService.softDeleteTransaction(customerId, transactionId);
    return res.json(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete transaction";
    if (message === "Transaction not found") return res.status(404).json({ message });
    if (message.includes("negative")) return res.status(409).json({ message });
    return res.status(500).json({ message: "Failed to delete transaction" });
  }
}

export async function restoreTransaction(req: Request, res: Response) {
  try {
    const { customerId, transactionId } = routeIds(req);
    if (!customerId || !transactionId) {
      return res.status(400).json({ message: "Customer and transaction ids are required" });
    }
    const transaction = await transactionService.restoreTransaction(customerId, transactionId);
    return res.json(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to restore transaction";
    if (message === "Deleted transaction not found") return res.status(404).json({ message });
    if (message.includes("negative")) return res.status(409).json({ message });
    return res.status(500).json({ message: "Failed to restore transaction" });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  try {
    const { customerId, transactionId } = routeIds(req);
    if (!customerId || !transactionId) {
      return res.status(400).json({ message: "Customer and transaction ids are required" });
    }
    const transaction = await transactionService.updateTransaction(customerId, transactionId, req.body);
    return res.json(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update transaction";
    if (message === "Transaction not found") return res.status(404).json({ message });
    if (message.includes("negative") || message.includes("required") || message.includes("greater") || message.includes("zero")) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: "Failed to update transaction" });
  }
}


