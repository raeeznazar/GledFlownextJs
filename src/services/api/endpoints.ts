export const endpoints = {
  login: "/auth/login",
  dashboard: "/dashboard",
  transactions: "/transactions",
  transaction: (id: string) => `/transactions/${id}`,
  customers: "/customers",
  customer: (id: string) => `/customers/${id}`,
  categories: "/categories",
  category: (id: string) => `/categories/${id}`,
  staff: "/staff",
  staffMember: (id: string) => `/staff/${id}`,
  analyticsOverview: "/analytics/overview",
  analyticsSales: "/analytics/sales",
};
