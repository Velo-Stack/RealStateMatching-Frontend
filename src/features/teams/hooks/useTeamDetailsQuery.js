import { useQuery } from "@tanstack/react-query";
import { TEAMS_QUERY_KEYS } from "../constants/teamsConstants";
import { fetchTeamById } from "../services/teamsApi";

export const useTeamDetailsQuery = (teamId, enabled) =>
  useQuery({
    queryKey: TEAMS_QUERY_KEYS.detail(teamId),
    queryFn: () => fetchTeamById(teamId),
    enabled: Boolean(teamId && enabled),
  });
