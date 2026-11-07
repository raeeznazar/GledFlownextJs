# Gled Flow — Business OS

An admin console for printing, LPG and retail operations: transactions, customers, categories,
staff & permissions, and analytics. Built in Next.js (App Router) from the
[Gled Flow Figma design](https://www.figma.com/design/JIJPWgtHcEZHv5P4lzL8iJ/Gled-Flow-website-design),
with a realistic mock API standing in for a real backend.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict, no `any`)
- **Tailwind CSS v4** with CSS-variable design tokens (`src/app/globals.css`) and full light/dark
  theming via `next-themes`
- **Zustand** (persisted auth store) + **TanStack Query** (server-state, caching, mutations)
- **Axios** hitting Next.js Route Handlers backed by an in-memory mock database
  (`src/lib/mock-db.ts`) — realistic latency, pagination, search/filter/sort, and a consistent
  `{ success, message, data, meta }` response envelope with Zod validation errors
- **React Hook Form + Zod** for the login form; lightweight controlled forms elsewhere
- **Lucide React** icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with any seeded email
(e.g. `raeez@gledflow.app`) and any password of 6+ characters — the mock auth API accepts any
credentials matching a seeded user.

## Project structure

```
src/
  app/                     routes (App Router) + API route handlers under app/api/**
  components/
    ui/                    design-system primitives (Button, Input, Table, Modal, Drawer, …)
    layout/                app shell (Sidebar, Topbar, PageHeader, Logo, ComingSoon)
    features/<domain>/     feature-specific components (modals, charts) grouped by domain
  hooks/                   TanStack Query hooks per domain
  services/                axios calls + typed request/response shapes per domain
  stores/                  Zustand stores (auth)
  lib/                     mock-db, api-response helpers, navigation, utils
  types/                   shared domain types
```

## Screens implemented

Login, Dashboard, Transactions (list + Add Transaction), Customers (list + details + Add
Customer), Categories (list + New Category), Staff & Access (list + Permissions editor + Add
Staff), Analytics (Overview + Sales). Products & Services, Reports, and Settings have no
corresponding screens in the Figma file; Settings is built out with real, working functionality
(account summary, theme toggle, logout) and the other two are clearly-labeled placeholders (see
below).

## Deviations from the Figma reference

The Figma reference models a few things the underlying data model doesn't (yet) support. Rather
than fake non-functional UI, each of these was adapted to what the app can actually do, and is
called out here:

- **Transactions — dropped "Status" column.** The data model has no completed/cancelled status
  on a transaction; only `type` (income/expense) is tracked.
- **Refunds.** The "Add Transaction" form's Income/Expense/Refund toggle maps "Refund" to
  `type: "expense"` with a "Refund —" note prefix, since the model only has two transaction
  types.
- **Customer Details — "Outstanding" → "Status".** No running balance/credit-terms field exists
  on a customer, so the fourth KPI card shows the customer's active/inactive status instead.
- **Categories — no subcategory hierarchy.** Categories are flat income/expense tags applied
  directly to transactions. The Figma "New Category" screen's dynamic subcategory list was
  replaced with a required Type (income/expense) toggle and a color-swatch picker — both of
  which the data model actually uses.
- **Permissions — coarser granularity.** The Figma permissions drawer models per-action
  (View/Create/Edit/Cancel/Export) checkboxes per module. The real permission model has 7 flatter
  flags (e.g. `transactions.manage`, `customers.manage`); the drawer's groups map 1:1 to those
  flags instead of inventing extra non-functional checkboxes.
- **Sales Analytics — different chart/table data.** The Figma screen shows a daily sparkline and
  per-product unit-sold bars; the `/analytics/sales` endpoint aggregates weekly totals and top
  customers (not daily/per-product-unit data), so the page charts what the endpoint actually
  returns: a weekly sales line and a top-customers list.
- **Logo/brand mark.** The real Figma logo asset couldn't be fetched in this environment
  (network egress to `figma.com` asset URLs is blocked here), so an original inline-SVG mark was
  designed in its place.
- **Products & Services / Reports.** No screens for these exist in the Figma file, and their
  implied functionality (a product catalogue with pricing/stock, exportable reports) has no
  backing data model. Both ship as clearly-labeled "coming soon" states rather than fabricated
  functionality.

## Mock API

Everything under `src/app/api/**` is a Next.js Route Handler reading/writing an in-memory array
in `src/lib/mock-db.ts` — it resets whenever the dev server restarts. It is not a real backend;
treat it as a fixture for frontend development.
