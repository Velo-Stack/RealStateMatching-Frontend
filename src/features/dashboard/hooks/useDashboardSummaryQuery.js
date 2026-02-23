import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../services/dashboardApi";
import { DASHBOARD_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useDashboardSummaryQuery = (enabled = true) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: fetchDashboardSummary,
    enabled,
  });
