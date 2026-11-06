import { FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Export and schedule business reports for accounting and tax filing."
      />
      <ComingSoon
        icon={FileText}
        title="Reports coming soon"
        description="You can already see the underlying numbers on the Analytics pages. Downloadable PDF/Excel reports and scheduled email delivery are on the roadmap."
      />
    </div>
  );
}
