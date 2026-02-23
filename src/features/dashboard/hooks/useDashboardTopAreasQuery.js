import { useQuery } from "@tanstack/react-query";
import { fetchTopAreas } from "../services/dashboardApi";
import { DASHBOARD_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useDashboardTopAreasQuery = (enabled) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.topAreas,
    queryFn: fetchTopAreas,
    enabled,
  });
