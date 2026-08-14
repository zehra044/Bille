const BASE_URL = "http://localhost:5000";

function flattenFieldErrors(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") return [];

  const values = Object.values(errors as Record<string, unknown>);
  const flattened: string[] = [];

  for (const value of values) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") flattened.push(item);
      }
      continue;
    }

    if (value && typeof value === "object") {
      flattened.push(...flattenFieldErrors(value));
    }
  }

  return flattened;
}

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errors = flattenFieldErrors(data?.errors);
    const detail = errors[0] || data?.message || `API error ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

export async function getCustomers() {
  return request(`/customers`);
}

export async function getCustomerById(id: string) {
  return request(`/customers/${id}`);
}

export async function getCustomerSummary(id: string) {
  return request(`/customers/${id}/summary`);
}

export async function createCustomer(payload: {
  fullName: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
}) {
  return request(`/customers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCustomer(id: string, payload: {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
}) {
  return request(`/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createTransaction(customerId: string, payload: {
  type: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  reason?: string;
}) {
  return request(`/customers/${customerId}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCustomerTransactions(customerId: string) {
  return request(`/customers/${customerId}/transactions`);
}

export async function deleteTransaction(customerId: string, transactionId: string) {
  return request(`/customers/${customerId}/transactions/${transactionId}`, {
    method: "DELETE",
  });
}

export async function restoreTransaction(customerId: string, transactionId: string) {
  return request(`/customers/${customerId}/transactions/${transactionId}/restore`, {
    method: "POST",
  });
}

export async function getDashboardSummary() {
  return request(`/dashboard`);
}

export async function getDailyCollections(date: string) {
  return request(`/reports/daily-collections?date=${encodeURIComponent(date)}`);
}

export async function getMonthlyCollections(year: number, month: number) {
  return request(`/reports/monthly-collections?year=${year}&month=${month}`);
}

export async function getOutstandingBalances() {
  return request(`/reports/outstanding-balances`);
}

export async function getTrash() {
  return request(`/trash`);
}

export async function deleteTrashTransaction(id: string) {
  return request(`/trash/transactions/${id}?confirm=true`, {
    method: "DELETE",
  });
}

export async function deleteTrashCustomer(id: string) {
  return request(`/trash/customers/${id}?confirm=true`, {
    method: "DELETE",
  });
}

export async function exportBackup() {
  return request(`/backup/export`);
}

export async function restoreBackup(backup: unknown) {
  return request(`/backup/restore`, {
    method: "POST",
    body: JSON.stringify({ confirm: true, backup }),
  });
}
