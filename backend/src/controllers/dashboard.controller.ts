import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export async function getDashboardSummary(_req: Request, res: Response) {
  try {
    return res.json(await dashboardService.getDashboardSummary());
  } catch {
    return res.status(500).json({ message: "Failed to load dashboard summary" });
  }
}
