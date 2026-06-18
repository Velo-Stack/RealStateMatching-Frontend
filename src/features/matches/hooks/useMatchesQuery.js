import { useQuery } from "@tanstack/react-query";
import { MATCHES_QUERY_KEY } from "../constants/matchesConstants";
import { fetchMatches } from "../services/matchesApi";

export const useMatchesQuery = (filters = {}) =>
  useQuery({
    queryKey: [...MATCHES_QUERY_KEY, filters],
    queryFn: () => fetchMatches(filters),
  });
