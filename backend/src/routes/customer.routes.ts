import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { validate } from "../middleware/validate";
import { createCustomerSchema } from "../validations/customer.validation";

const router = Router();

router.post(
  "/",
  validate(createCustomerSchema),
  customerController.createCustomer,
);

router.get("/", customerController.getCustomers);

router.get("/:id", customerController.getCustomerById);
export default router;
