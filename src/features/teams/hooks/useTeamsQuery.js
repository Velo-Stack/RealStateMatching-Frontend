import { useQuery } from "@tanstack/react-query";
import { TEAMS_QUERY_KEY } from "../constants/teamsConstants";
import { fetchTeams } from "../services/teamsApi";

export const useTeamsQuery = () =>
  useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: fetchTeams,
  });
