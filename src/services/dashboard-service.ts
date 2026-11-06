import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse, DashboardData } from "@/types";

export async function fetchDashboard() {
  const { data } = await api.get<ApiResponse<DashboardData>>(endpoints.dashboard);
  return data.data;
}
