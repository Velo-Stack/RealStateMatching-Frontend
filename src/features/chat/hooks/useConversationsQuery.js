import { useQuery } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";
import { fetchConversations } from "../services/chatApi";

export const useConversationsQuery = () =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations,
    queryFn: fetchConversations,
  });
