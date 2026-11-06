import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse } from "@/types";

export interface AnalyticsOverview {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  margin: number;
  byCategory: { name: string; type: string; color: string; total: number; count: number }[];
  monthlyTrend: { label: string; income: number; expense: number }[];
}

export interface AnalyticsSales {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  topCustomers: { name: string; totalSpent: number; totalOrders: number }[];
  weeklySales: { label: string; value: number }[];
}

export async function fetchAnalyticsOverview() {
  const { data } = await api.get<ApiResponse<AnalyticsOverview>>(endpoints.analyticsOverview);
  return data.data;
}

export async function fetchAnalyticsSales() {
  const { data } = await api.get<ApiResponse<AnalyticsSales>>(endpoints.analyticsSales);
  return data.data;
}
