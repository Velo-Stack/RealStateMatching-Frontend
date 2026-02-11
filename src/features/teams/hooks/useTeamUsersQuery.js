import { useQuery } from "@tanstack/react-query";
import { USERS_QUERY_KEY } from "../constants/teamsConstants";
import { fetchTeamUsers } from "../services/teamsApi";

export const useTeamUsersQuery = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchTeamUsers,
  });
