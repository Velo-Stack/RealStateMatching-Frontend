import { useQuery } from "@tanstack/react-query";
import { REQUESTS_QUERY_KEY } from "../../requests/constants/requestsConstants";
import { fetchRequests } from "../../requests/services/requestsApi";

export const useDashboardRequestsQuery = (enabled) =>
  useQuery({
    queryKey: REQUESTS_QUERY_KEY,
    queryFn: fetchRequests,
    staleTime: 60_000,
    enabled,
  });
