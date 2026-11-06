import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("business-os-auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.user?.id;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore malformed storage
      }
    }
  }
  return config;
});

export interface ApiErrorShape {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape>) => {
    const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
