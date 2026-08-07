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
    const customer = await customerService.getCustomerById(req.params.id);

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
    const customer = await customerService.getCustomerSummary(req.params.id);

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
