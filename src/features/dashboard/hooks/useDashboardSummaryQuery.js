import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../services/dashboardApi";

export const useDashboardSummaryQuery = (enabled = true) =>
  useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
    enabled,
  });
