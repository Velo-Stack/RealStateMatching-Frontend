import { useQuery } from "@tanstack/react-query";
import { MATCHES_QUERY_KEY } from "../../matches/constants/matchesConstants";
import { fetchMatches } from "../../matches/services/matchesApi";

export const useDashboardMatchesQuery = (enabled) =>
  useQuery({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: fetchMatches,
    staleTime: 60_000,
    enabled,
  });
