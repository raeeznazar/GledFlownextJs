import { ok, simulateLatency } from "@/lib/api-response";
import { customers, transactions } from "@/lib/mock-db";

export async function GET() {
  await simulateLatency();

  const income = transactions.filter((t) => t.type === "income");
  const totalSales = income.reduce((s, t) => s + t.amount, 0);
  const avgOrderValue = income.length ? Math.round(totalSales / income.length) : 0;

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 6)
    .map((c) => ({ name: c.name, totalSpent: c.totalSpent, totalOrders: c.totalOrders }));

  const weeks = ["W1", "W2", "W3", "W4"];
  const weeklySales = weeks.map((label, i) => ({
    label,
    value: Math.round(totalSales * (0.18 + i * 0.07)),
  }));

  return ok({
    totalSales,
    totalOrders: income.length,
    avgOrderValue,
    conversionRate: 68,
    topCustomers,
    weeklySales,
  });
}
