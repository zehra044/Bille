import { Router } from "express";
import * as trashController from "../controllers/trash.controller";

const router = Router();
router.get("/", trashController.listTrash);
router.delete("/transactions/:id", trashController.deleteTransactionPermanently);
router.delete("/customers/:id", trashController.deleteCustomerPermanently);

export default router;
