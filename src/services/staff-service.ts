import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse, Permission, StaffMember, StaffRole } from "@/types";

export interface CreateStaffInput {
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
}

export interface UpdateStaffInput {
  name?: string;
  role?: StaffRole;
  status?: StaffMember["status"];
  permissions?: Permission[];
}

export async function fetchStaff() {
  const { data } = await api.get<ApiResponse<StaffMember[]>>(endpoints.staff);
  return data.data;
}

export async function fetchStaffMember(id: string) {
  const { data } = await api.get<ApiResponse<StaffMember>>(endpoints.staffMember(id));
  return data.data;
}

export async function createStaffMember(input: CreateStaffInput) {
  const { data } = await api.post<ApiResponse<StaffMember>>(endpoints.staff, input);
  return data.data;
}

export async function updateStaffMember(id: string, input: UpdateStaffInput) {
  const { data } = await api.put<ApiResponse<StaffMember>>(endpoints.staffMember(id), input);
  return data.data;
}

export async function deleteStaffMember(id: string) {
  const { data } = await api.delete<ApiResponse<StaffMember>>(endpoints.staffMember(id));
  return data.data;
}
