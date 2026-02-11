import { useQuery } from "@tanstack/react-query";
import { USERS_QUERY_KEY } from "../constants/usersConstants";
import { fetchUsers } from "../services/usersApi";

export const useUsersQuery = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
  });
