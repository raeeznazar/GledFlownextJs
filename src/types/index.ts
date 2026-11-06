export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string; // ISO
  time: string; // HH:mm
  customerId: string | null;
  customerName: string;
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderAt: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  transactionCount: number;
  createdAt: string;
}

export type StaffRole = "admin" | "staff" | "ceo";

export interface Permission {
  key: string;
  label: string;
  allowed: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: "active" | "suspended";
  permissions: Permission[];
  createdAt: string;
}

export interface KpiSummary {
  todaySales: number;
  todaySalesChange: number;
  todayIncome: number;
  todayIncomeChange: number;
  todayExpenses: number;
  todayExpensesChange: number;
  todayProfit: number;
  todayProfitChange: number;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface SalesExpensePoint {
  label: string;
  sales: number;
  expenses: number;
}

export interface TopProduct {
  name: string;
  amount: number;
}

export interface Insight {
  tone: "brand" | "danger" | "success";
  text: string;
}

export interface DashboardData {
  greetingName: string;
  kpis: KpiSummary;
  recentTransactions: Transaction[];
  revenueTrend: RevenuePoint[];
  salesVsExpenses: SalesExpensePoint[];
  topProducts: TopProduct[];
  insights: Insight[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: Record<string, string[]>;
}
