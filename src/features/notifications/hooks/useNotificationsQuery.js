import { useQuery } from "@tanstack/react-query";
import {
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_REFETCH_INTERVAL,
} from "../constants/notificationsConstants";
import { fetchNotifications } from "../services/notificationsApi";

export const useNotificationsQuery = () =>
  useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    refetchInterval: NOTIFICATIONS_REFETCH_INTERVAL,
  });
