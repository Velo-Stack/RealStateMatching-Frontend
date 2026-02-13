import { useMarkNotificationReadMutation } from "./useMarkNotificationReadMutation";
import { useNotificationSoundEffect } from "./useNotificationSoundEffect";
import { useNotificationsQuery } from "./useNotificationsQuery";
import { getUnreadCount } from "../utils/notificationsUtils";

export const useNotificationsData = () => {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const unreadCount = getUnreadCount(notifications);

  useNotificationSoundEffect(notifications);

  return {
    notifications,
    isLoading,
    markRead,
    unreadCount,
  };
};
