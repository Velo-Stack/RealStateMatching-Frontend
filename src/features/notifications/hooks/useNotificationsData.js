import { useMarkNotificationReadMutation } from "./useMarkNotificationReadMutation";
import { useNotificationsQuery } from "./useNotificationsQuery";
import { getUnreadCount } from "../utils/notificationsUtils";

export const useNotificationsData = () => {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const unreadCount = getUnreadCount(notifications);

  return {
    notifications,
    isLoading,
    markRead,
    unreadCount,
  };
};
