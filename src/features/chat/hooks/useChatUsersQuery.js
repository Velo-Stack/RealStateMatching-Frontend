import { useQuery } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { fetchUsers } from "../services/chatApi";

export const useChatUsersQuery = (enabled) =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.users,
    queryFn: fetchUsers,
    enabled,
  });
