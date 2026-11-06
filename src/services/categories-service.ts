import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse, Category, TransactionType } from "@/types";

export interface CreateCategoryInput {
  name: string;
  type: TransactionType;
  color?: string;
}

export async function fetchCategories(type?: TransactionType) {
  const { data } = await api.get<ApiResponse<Category[]>>(endpoints.categories, {
    params: type ? { type } : undefined,
  });
  return data.data;
}

export async function createCategory(input: CreateCategoryInput) {
  const { data } = await api.post<ApiResponse<Category>>(endpoints.categories, input);
  return data.data;
}

export async function deleteCategory(id: string) {
  const { data } = await api.delete<ApiResponse<Category>>(endpoints.category(id));
  return data.data;
}
