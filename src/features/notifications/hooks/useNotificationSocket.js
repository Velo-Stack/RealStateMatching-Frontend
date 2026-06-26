import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getSocketConnectOptions } from "../../../utils/apiBaseUrl";
import {
  NOTIFICATIONS_QUERY_KEY,
  SOCKET_NOTIFICATION_EVENTS,
} from "../constants/notificationsConstants";

export const useNotificationSocket = ({ enabled, userId }) => {
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const refreshNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    queryClient.refetchQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
  }, [queryClient]);

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

    const onNotificationEvent = () => {
      refreshNotifications();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    SOCKET_NOTIFICATION_EVENTS.forEach((eventName) => {
      socket.on(eventName, onNotificationEvent);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      SOCKET_NOTIFICATION_EVENTS.forEach((eventName) => {
        socket.off(eventName, onNotificationEvent);
      });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, userId, refreshNotifications]);

  return { isConnected };
};
