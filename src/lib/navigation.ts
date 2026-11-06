import {
  LayoutGrid,
  Receipt,
  Users,
  Box,
  BarChart3,
  UserCheck,
  Tags,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Transactions", href: "/transactions", icon: Receipt },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products & Services", href: "/products", icon: Box },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Staff & Access", href: "/staff", icon: UserCheck },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];
