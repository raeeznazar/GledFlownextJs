import { ok, simulateLatency } from "@/lib/api-response";
import { categories, transactions } from "@/lib/mock-db";

export async function GET() {
  await simulateLatency();

  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expense.reduce((s, t) => s + t.amount, 0);

  const byCategory = categories
    .map((c) => ({
      name: c.name,
      type: c.type,
      color: c.color,
      total: transactions
        .filter((t) => t.categoryId === c.id)
        .reduce((s, t) => s + t.amount, 0),
      count: c.transactionCount,
    }))
    .sort((a, b) => b.total - a.total);

  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const monthlyTrend = months.map((label, i) => ({
    label,
    income: Math.round(totalIncome * (0.6 + i * 0.08)),
    expense: Math.round(totalExpense * (0.6 + i * 0.07)),
  }));

  return ok({
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    margin: totalIncome ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
    byCategory,
    monthlyTrend,
  });
}
