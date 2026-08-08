import { Router } from "express";
import * as reportController from "../controllers/report.controller";

const router = Router();
router.get("/daily-collections", reportController.dailyCollection);
router.get("/monthly-collections", reportController.monthlyCollection);
router.get("/outstanding-balances", reportController.outstandingBalances);
router.get("/customers/:id/statement", reportController.customerStatement);

export default router;
