import { Box } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function ProductsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Products & Services"
        description="A dedicated catalogue of your printing products and services."
      />
      <ComingSoon
        icon={Box}
        title="Product catalogue coming soon"
        description="Today, products and services are tracked as Categories. A dedicated catalogue with pricing, stock, and unit tracking is on the roadmap."
      />
    </div>
  );
}
