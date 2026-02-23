import { useQuery } from "@tanstack/react-query";
import { fetchTopBrokers } from "../services/dashboardApi";
import { DASHBOARD_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useDashboardTopBrokersQuery = (enabled) =>
  useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.topBrokers,
    queryFn: fetchTopBrokers,
    enabled,
  });
