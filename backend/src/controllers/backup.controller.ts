import { Request, Response } from "express";
import * as backupService from "../services/backup.service";

export async function exportBackup(_req: Request, res: Response) {
  try {
    const backup = await backupService.exportBackup();
    res.attachment(`bille-backup-${backup.exportedAt.toISOString().slice(0, 10)}.json`);
    return res.json(backup);
  } catch {
    return res.status(500).json({ message: "Failed to export backup" });
  }
}

export async function restoreBackup(req: Request, res: Response) {
  try {
    const result = await backupService.restoreBackup(req.body.backup);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Invalid backup",
    });
  }
}
