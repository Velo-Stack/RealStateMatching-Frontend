import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getSocketConnectOptions } from "../../../utils/apiBaseUrl";
import { CHAT_QUERY_KEYS } from "../constants/chatConstants";

export const useChatSocket = ({ enabled, userId }) => {
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
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

    const { url, options } = getSocketConnectOptions();
    const socket = io(url, {
      ...options,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 30000,
    });
    socketRef.current = socket;

    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join", userId);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onNewMessage = (payload) => {
      refreshChat(payload?.conversationId);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-message", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-message", onNewMessage);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, userId, refreshChat]);

  return { isConnected };
};
