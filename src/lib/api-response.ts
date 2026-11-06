import { NextResponse } from "next/server";
import type { ApiResponse, Paginated } from "@/types";

export function ok<T>(data: T, message = "Data fetched successfully", status = 200) {
  const body: ApiResponse<T> = { success: true, message, data };
  return NextResponse.json(body, { status });
}

export function paginated<T>(
  result: Paginated<T>,
  message = "Data fetched successfully"
) {
  const body: ApiResponse<T[]> = {
    success: true,
    message,
    data: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  };
  return NextResponse.json(body, { status: 200 });
}

export function created<T>(data: T, message = "Created successfully") {
  const body: ApiResponse<T> = { success: true, message, data };
  return NextResponse.json(body, { status: 201 });
}

export function fail(message: string, status = 400, errors?: Record<string, string[]>) {
  const body: ApiResponse<null> = { success: false, message, data: null, errors };
  return NextResponse.json(body, { status });
}

export function notFound(message = "Resource not found") {
  return fail(message, 404);
}

export function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    page,
    limit,
    total,
    totalPages,
  };
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10) || 10));
  return { page, limit };
}

export async function simulateLatency() {
  const ms = Math.floor(Math.random() * 700) + 300; // 300–1000ms
  await new Promise((resolve) => setTimeout(resolve, ms));
}
