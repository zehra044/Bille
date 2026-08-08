import { Request, Response } from "express";
import * as trashService from "../services/trash.service";

function isConfirmed(req: Request) {
  return req.query.confirm === "true";
}

export async function listTrash(_req: Request, res: Response) {
  try {
    return res.json(await trashService.listTrash());
  } catch {
    return res.status(500).json({ message: "Failed to load trash" });
  }
}

export async function deleteTransactionPermanently(req: Request, res: Response) {
  if (!isConfirmed(req)) return res.status(409).json({ message: "Confirmation is required to permanently delete this transaction" });
  const id = typeof req.params.id === "string" ? req.params.id : undefined;
  if (!id) return res.status(400).json({ message: "Transaction id is required" });
  try {
    const transaction = await trashService.permanentlyDeleteTransaction(id);
    return transaction ? res.status(204).send() : res.status(404).json({ message: "Deleted transaction not found" });
  } catch {
    return res.status(500).json({ message: "Failed to permanently delete transaction" });
  }
}

export async function deleteCustomerPermanently(req: Request, res: Response) {
  if (!isConfirmed(req)) return res.status(409).json({ message: "Confirmation is required to permanently delete this customer" });
  const id = typeof req.params.id === "string" ? req.params.id : undefined;
  if (!id) return res.status(400).json({ message: "Customer id is required" });
  try {
    const customer = await trashService.permanentlyDeleteCustomer(id);
    return customer ? res.status(204).send() : res.status(404).json({ message: "Archived customer not found" });
  } catch {
    return res.status(500).json({ message: "Failed to permanently delete customer" });
  }
}
