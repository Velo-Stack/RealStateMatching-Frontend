import { useQuery } from "@tanstack/react-query";
import { fetchDashboardActivityGaps } from "../services/dashboardApi";
import { DASHBOARD_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useDashboardActivityGapsQuery = (enabled) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activityGaps,
    queryFn: fetchDashboardActivityGaps,
    enabled,
  });
