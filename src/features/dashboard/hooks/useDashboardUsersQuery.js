import { useQuery } from "@tanstack/react-query";
import { USERS_QUERY_KEY } from "../../users/constants/usersConstants";
import { fetchUsers } from "../../users/services/usersApi";

export const useDashboardUsersQuery = (enabled) =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: 60_000,
    enabled,
  });
