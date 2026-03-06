import { useQuery } from "@tanstack/react-query";
import { TEAMS_QUERY_KEYS } from "../constants/teamsConstants";
import { fetchTeamMembers } from "../services/teamsApi";

export const useTeamMembersQuery = (teamId, enabled) =>
  useQuery({
    queryKey: TEAMS_QUERY_KEYS.members(teamId),
    queryFn: () => fetchTeamMembers(teamId),
    enabled: Boolean(teamId && enabled),
  });
