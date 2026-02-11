import { useQuery } from "@tanstack/react-query";
import {
  CHAT_QUERY_KEYS,
  MESSAGES_REFETCH_INTERVAL,
} from "../constants/chatConstants";
import { fetchMessages } from "../services/chatApi";

export const useMessagesQuery = (selectedConvId) =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(selectedConvId),
    queryFn: async () => {
      if (!selectedConvId) return [];
      return fetchMessages(selectedConvId);
    },
    enabled: !!selectedConvId,
    refetchInterval: MESSAGES_REFETCH_INTERVAL,
  });
