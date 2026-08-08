import { Router } from "express";
import * as backupController from "../controllers/backup.controller";
import { validate } from "../middleware/validate";
import { restoreBackupSchema } from "../validations/backup.validation";

const router = Router();
router.get("/export", backupController.exportBackup);
router.post("/restore", validate(restoreBackupSchema), backupController.restoreBackup);

export default router;
