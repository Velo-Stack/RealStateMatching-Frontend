import { useQuery } from "@tanstack/react-query";
import { useNotificationRealtime } from "../context/NotificationRealtimeContext";
import {
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_REFETCH_INTERVAL,
  NOTIFICATIONS_SOCKET_REFETCH_INTERVAL,
} from "../constants/notificationsConstants";
import { fetchNotifications } from "../services/notificationsApi";

export const useNotificationsQuery = (enabled = true) => {
  const { socketConnected } = useNotificationRealtime();
  const refetchInterval = socketConnected
    ? NOTIFICATIONS_SOCKET_REFETCH_INTERVAL
    : NOTIFICATIONS_REFETCH_INTERVAL;

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    enabled,
    refetchInterval: enabled ? refetchInterval : false,
    refetchIntervalInBackground: true,
  });
};
