import { ok, simulateLatency } from "@/lib/api-response";
import { transactions } from "@/lib/mock-db";
import type { DashboardData } from "@/types";

export async function GET() {
  await simulateLatency();

  const today = new Date().toISOString().slice(0, 10);
  const todays = transactions.filter((t) => t.date === today);
  const income = todays.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = todays.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const revenueTrend = days.map((label, i) => ({
    label,
    value: 1200 + i * 240 + Math.round(Math.sin(i) * 180),
  }));

  const salesVsExpenses = days.slice(0, 5).map((label, i) => ({
    label,
    sales: 60 + i * 9 + Math.round(Math.random() * 12),
    expenses: 28 + i * 4 + Math.round(Math.random() * 8),
  }));

  const topProducts = [
    { name: "Color Printing", amount: 125480 },
    { name: "Mono Printing", amount: 92250 },
    { name: "Lamination", amount: 51300 },
    { name: "Binding", amount: 34500 },
  ];

  const data: DashboardData = {
    greetingName: "Admin",
    kpis: {
      todaySales: income + expenses || 24850,
      todaySalesChange: 12,
      todayIncome: income || 28450,
      todayIncomeChange: 8.5,
      todayExpenses: expenses || 8200,
      todayExpensesChange: -4.1,
      todayProfit: income - expenses || 20250,
      todayProfitChange: 15,
    },
    recentTransactions: (todays.length ? todays : transactions.slice(0, 3)).slice(0, 6),
    revenueTrend,
    salesVsExpenses,
    topProducts,
    insights: [
      { tone: "brand", text: "Color printing generated 31% of your revenue this month." },
      { tone: "danger", text: "Paper expenses increased 22% this month." },
      { tone: "success", text: "Friday generates 34% more revenue than your average weekday." },
    ],
  };

  return ok(data);
}
