import type {
  Category,
  Customer,
  StaffMember,
  Transaction,
} from "@/types";

/**
 * In-memory mock "database". Lives for the lifetime of the dev server
 * process. Seeded once on first import, then mutated by the route
 * handlers in src/app/api/**. This is intentionally simple — swap for
 * real persistence (Postgres, etc.) behind the same route handlers
 * when a backend exists.
 */

function id(prefix: string, n: number) {
  return `${prefix}_${String(n).padStart(4, "0")}`;
}

const categorySeed: Array<Pick<Category, "name" | "type" | "color">> = [
  { name: "Color Printing", type: "income", color: "#2554e0" },
  { name: "Mono Printing", type: "income", color: "#0e7490" },
  { name: "Lamination", type: "income", color: "#15803d" },
  { name: "Binding", type: "income", color: "#b45309" },
  { name: "Paper", type: "expense", color: "#ef4444" },
  { name: "Ink & Toner", type: "expense", color: "#f97316" },
  { name: "Electricity", type: "expense", color: "#a855f7" },
  { name: "Rent", type: "expense", color: "#64748b" },
  { name: "Maintenance", type: "expense", color: "#0ea5e9" },
];

export const categories: Category[] = categorySeed.map((c, i) => ({
  id: id("cat", i + 1),
  name: c.name,
  type: c.type,
  color: c.color,
  transactionCount: 0,
  createdAt: new Date(2026, 8, 1 + i).toISOString(),
}));

const customerNames = [
  "ABC Printers",
  "XYZ Traders",
  "John Mathew",
  "Sunrise Stationery",
  "Kochi Copy Center",
  "Nazar Enterprises",
  "Metro Print Hub",
  "Green Leaf Packaging",
  "Blue Ocean Media",
  "Coral Reef Designs",
  "Unity Print Solutions",
  "Horizon Office Supplies",
];

export const customers: Customer[] = customerNames.map((name, i) => ({
  id: id("cus", i + 1),
  name,
  phone: `+91 98${(450000000 + i * 137).toString().slice(0, 8)}`,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
  company: i % 3 === 0 ? name : undefined,
  address: "Infopark, Kochi, Kerala",
  totalSpent: 0,
  totalOrders: 0,
  lastOrderAt: null,
  status: i % 7 === 6 ? "inactive" : "active",
  createdAt: new Date(2026, 7, 1 + i).toISOString(),
}));

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const transactions: Transaction[] = Array.from({ length: 64 }).map((_, i) => {
  const customer = customers[i % customers.length];
  const isIncomeCategory = i % 3 !== 0;
  const category = isIncomeCategory
    ? categories.filter((c) => c.type === "income")[i % 4]
    : categories.filter((c) => c.type === "expense")[i % 5];
  const daysAgo = Math.floor(i / 4);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomBetween(8, 19), randomBetween(0, 59), 0, 0);

  const amount =
    category.type === "income" ? randomBetween(250, 8500) : randomBetween(150, 4200);

  category.transactionCount += 1;
  if (category.type === "income") {
    customer.totalSpent += amount;
    customer.totalOrders += 1;
    if (!customer.lastOrderAt || date > new Date(customer.lastOrderAt)) {
      customer.lastOrderAt = date.toISOString();
    }
  }

  return {
    id: id("txn", i + 1),
    date: date.toISOString().slice(0, 10),
    time: date.toTimeString().slice(0, 5),
    customerId: customer.id,
    customerName: customer.name,
    categoryId: category.id,
    categoryName: category.name,
    type: category.type,
    amount,
    note: undefined,
    createdAt: date.toISOString(),
  };
});

const permissionDefs = [
  { key: "transactions.view", label: "View transactions" },
  { key: "transactions.manage", label: "Add / edit transactions" },
  { key: "customers.manage", label: "Manage customers" },
  { key: "categories.manage", label: "Manage categories" },
  { key: "staff.manage", label: "Manage staff & access" },
  { key: "analytics.view", label: "View analytics & reports" },
  { key: "settings.manage", label: "Manage business settings" },
];

function permissionsFor(role: StaffMember["role"]) {
  return permissionDefs.map((p) => ({
    ...p,
    allowed:
      role === "ceo" || role === "admin"
        ? true
        : ["transactions.view", "transactions.manage", "customers.manage"].includes(p.key),
  }));
}

export const staff: StaffMember[] = [
  { name: "Raeez Nazar", email: "raeez@gledflow.app", role: "admin" as const },
  { name: "Ayesha Kamal", email: "ayesha@gledflow.app", role: "staff" as const },
  { name: "Vineeth P S", email: "vineeth@gledflow.app", role: "staff" as const },
  { name: "Divya Menon", email: "divya@gledflow.app", role: "ceo" as const },
  { name: "Arjun Dev", email: "arjun@gledflow.app", role: "staff" as const },
].map((s, i) => ({
  id: id("stf", i + 1),
  name: s.name,
  email: s.email,
  phone: `+91 97${(220000000 + i * 311).toString().slice(0, 8)}`,
  role: s.role,
  status: "active" as const,
  permissions: permissionsFor(s.role),
  createdAt: new Date(2026, 5, 1 + i * 10).toISOString(),
}));

export function nextId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
}
