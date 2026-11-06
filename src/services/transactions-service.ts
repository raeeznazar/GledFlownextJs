import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse, Paginated, Transaction, TransactionType } from "@/types";

export interface TransactionQuery {
  page?: number;
  limit?: number;
  q?: string;
  type?: TransactionType;
  categoryId?: string;
  sort?: string;
}

export interface CreateTransactionInput {
  customerId?: string;
  customerName: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date?: string;
}

export async function fetchTransactions(query: TransactionQuery = {}) {
  const { data } = await api.get<ApiResponse<Transaction[]>>(endpoints.transactions, {
    params: query,
  });
  const result: Paginated<Transaction> = {
    items: data.data,
    page: data.meta?.page ?? 1,
    limit: data.meta?.limit ?? 10,
    total: data.meta?.total ?? data.data.length,
    totalPages: data.meta?.totalPages ?? 1,
  };
  return result;
}

export async function fetchTransaction(id: string) {
  const { data } = await api.get<ApiResponse<Transaction>>(endpoints.transaction(id));
  return data.data;
}

export async function createTransaction(input: CreateTransactionInput) {
  const { data } = await api.post<ApiResponse<Transaction>>(endpoints.transactions, input);
  return data.data;
}

export async function updateTransaction(id: string, input: Partial<CreateTransactionInput>) {
  const { data } = await api.put<ApiResponse<Transaction>>(endpoints.transaction(id), input);
  return data.data;
}

export async function deleteTransaction(id: string) {
  const { data } = await api.delete<ApiResponse<Transaction>>(endpoints.transaction(id));
  return data.data;
}
