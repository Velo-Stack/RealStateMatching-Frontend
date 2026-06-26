import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  acquireRealtimeSocket,
  releaseRealtimeSocket,
  subscribeRealtimeConnection,
  subscribeRealtimeEvent,
} from "../../../shared/socket/realtimeSocket";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";

export const useChatSocket = ({ enabled, userId }) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const refreshChat = useCallback(
    (conversationId) => {
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: CHAT_QUERY_KEYS.messages(conversationId),
        });
        queryClient.refetchQueries({
          queryKey: CHAT_QUERY_KEYS.messages(conversationId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations,
      });
    },
    [queryClient],
  );

  useEffect(() => {
    if (!enabled || !userId) {
      setIsConnected(false);
      return undefined;
    }

    acquireRealtimeSocket(userId);

    const unsubscribeConnection = subscribeRealtimeConnection(
      () => setIsConnected(true),
      () => setIsConnected(false),
    );

    const unsubscribeNewMessage = subscribeRealtimeEvent("new-message", (payload) => {
      refreshChat(payload?.conversationId);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeNewMessage();
      releaseRealtimeSocket();
      setIsConnected(false);
    };
  }, [enabled, userId, refreshChat]);

  return { isConnected };
};
