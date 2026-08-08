import { Request, Response } from "express";
import * as reportService from "../services/report.service";

export async function customerStatement(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : undefined;
  if (!id) return res.status(400).json({ message: "Customer id is required" });
  try {
    const statement = await reportService.getCustomerStatement(id);
    return statement ? res.json(statement) : res.status(404).json({ message: "Customer not found" });
  } catch {
    return res.status(500).json({ message: "Failed to load customer statement" });
  }
}

export async function dailyCollection(req: Request, res: Response) {
  const date = typeof req.query.date === "string" ? req.query.date : undefined;
  if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
  try {
    const transactions = await reportService.getDailyCollectionReport(date);
    const totalCollected = transactions.reduce((total, transaction) => total + transaction.amount.toNumber(), 0);
    return res.json({ date, totalCollected, transactions });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid date" });
  }
}

export async function monthlyCollection(req: Request, res: Response) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  try {
    const transactions = await reportService.getMonthlyCollectionReport(year, month);
    const totalCollected = transactions.reduce((total, transaction) => total + transaction.amount.toNumber(), 0);
    return res.json({ year, month, totalCollected, transactions });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid month" });
  }
}

export async function outstandingBalances(_req: Request, res: Response) {
  try {
    return res.json(await reportService.getOutstandingBalanceReport());
  } catch {
    return res.status(500).json({ message: "Failed to load outstanding balances" });
  }
}
