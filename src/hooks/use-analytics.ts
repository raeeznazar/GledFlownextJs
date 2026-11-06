import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsOverview, fetchAnalyticsSales } from "@/services/analytics-service";

export function useAnalyticsOverview() {
  return useQuery({ queryKey: ["analytics", "overview"], queryFn: fetchAnalyticsOverview });
}

export function useAnalyticsSales() {
  return useQuery({ queryKey: ["analytics", "sales"], queryFn: fetchAnalyticsSales });
}
