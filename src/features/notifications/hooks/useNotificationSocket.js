import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  acquireRealtimeSocket,
  releaseRealtimeSocket,
  subscribeRealtimeConnection,
  subscribeRealtimeEvent,
} from "../../../shared/socket/realtimeSocket";
import {
  NOTIFICATIONS_QUERY_KEY,
  SOCKET_NOTIFICATION_EVENTS,
} from "../constants/notificationsConstants";

export const useNotificationSocket = ({ enabled, userId }) => {
  const queryClient = useQueryClient();
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

    acquireRealtimeSocket(userId);

    const unsubscribeConnection = subscribeRealtimeConnection(
      () => setIsConnected(true),
      () => setIsConnected(false),
    );

    const unsubscribeEvents = SOCKET_NOTIFICATION_EVENTS.map((eventName) =>
      subscribeRealtimeEvent(eventName, refreshNotifications),
    );

    return () => {
      unsubscribeConnection();
      unsubscribeEvents.forEach((unsubscribe) => unsubscribe());
      releaseRealtimeSocket();
      setIsConnected(false);
    };
  }, [enabled, userId, refreshNotifications]);

  return { isConnected };
};
