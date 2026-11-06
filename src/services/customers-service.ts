import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse, Customer, Paginated, Transaction } from "@/types";

export interface CustomerQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: Customer["status"];
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
}

export async function fetchCustomers(query: CustomerQuery = {}) {
  const { data } = await api.get<ApiResponse<Customer[]>>(endpoints.customers, {
    params: query,
  });
  const result: Paginated<Customer> = {
    items: data.data,
    page: data.meta?.page ?? 1,
    limit: data.meta?.limit ?? 10,
    total: data.meta?.total ?? data.data.length,
    totalPages: data.meta?.totalPages ?? 1,
  };
  return result;
}

export async function fetchCustomer(id: string) {
  const { data } = await api.get<ApiResponse<Customer & { orders: Transaction[] }>>(
    endpoints.customer(id)
  );
  return data.data;
}

export async function createCustomer(input: CreateCustomerInput) {
  const { data } = await api.post<ApiResponse<Customer>>(endpoints.customers, input);
  return data.data;
}

export async function updateCustomer(id: string, input: Partial<CreateCustomerInput & { status: Customer["status"] }>) {
  const { data } = await api.put<ApiResponse<Customer>>(endpoints.customer(id), input);
  return data.data;
}

export async function deleteCustomer(id: string) {
  const { data } = await api.delete<ApiResponse<Customer>>(endpoints.customer(id));
  return data.data;
}
