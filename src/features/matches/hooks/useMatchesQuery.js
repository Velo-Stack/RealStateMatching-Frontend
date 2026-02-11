import { useQuery } from "@tanstack/react-query";
import { MATCHES_QUERY_KEY } from "../constants/matchesConstants";
import { fetchMatches } from "../services/matchesApi";

export const useMatchesQuery = () =>
  useQuery({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: fetchMatches,
  });
