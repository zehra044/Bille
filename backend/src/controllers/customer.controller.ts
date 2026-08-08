import { Request, Response } from "express";
import * as customerService from "../services/customer.service";
import { calculateSummary } from "../services/ledger.service";
export async function createCustomer(req: Request, res: Response) {
  try {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create customer",
    });
  }
}

export async function getCustomers(req: Request, res: Response) {
  try {
    const customers = await customerService.getCustomers();

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) return res.status(400).json({ message: "Customer id is required" });
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
}

export async function getCustomerSummary(req: Request, res: Response) {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) return res.status(400).json({ message: "Customer id is required" });
    const customer = await customerService.getCustomerSummary(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const summary = calculateSummary(customer.transactions);

    res.json({
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
      },
      summary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load customer summary",
    });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) return res.status(400).json({ message: "Customer id is required" });

    const customer = await customerService.updateCustomer(id, req.body);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    return res.json(customer);
  } catch {
    return res.status(500).json({ message: "Failed to update customer" });
  }
}

export async function archiveCustomer(req: Request, res: Response) {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : undefined;
    if (!id) return res.status(400).json({ message: "Customer id is required" });
    const confirmed = req.query.confirm === "true";
    const result = await customerService.archiveCustomer(id, confirmed);

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (result.status === "CONFIRMATION_REQUIRED") {
      return res.status(409).json({
        message: "This customer has an outstanding balance. Confirm before archiving.",
        balance: result.balance,
      });
    }
    return res.json(result.customer);
  } catch {
    return res.status(500).json({ message: "Failed to archive customer" });
  }
}
