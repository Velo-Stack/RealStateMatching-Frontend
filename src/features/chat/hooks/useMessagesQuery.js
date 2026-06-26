import { useQuery } from "@tanstack/react-query";
import {
  CHAT_QUERY_KEYS,
  MESSAGES_REFETCH_INTERVAL,
  MESSAGES_SOCKET_REFETCH_INTERVAL,
} from "../constants/chatConstants";
import { fetchMessages } from "../services/chatApi";

export const useMessagesQuery = (selectedConvId, socketConnected = false) => {
  const refetchInterval = socketConnected
    ? MESSAGES_SOCKET_REFETCH_INTERVAL
    : MESSAGES_REFETCH_INTERVAL;

  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(selectedConvId),
    queryFn: async () => {
      if (!selectedConvId) return [];
      return fetchMessages(selectedConvId);
    },
    enabled: !!selectedConvId,
    refetchInterval: selectedConvId ? refetchInterval : false,
    refetchIntervalInBackground: true,
  });
};
