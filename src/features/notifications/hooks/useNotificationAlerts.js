import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NOTIFICATION_SOUND_URL } from "../constants/notificationsConstants";
import { getNotificationContent } from "../utils/notificationsUtils";
import { resolveNotificationPath } from "../utils/notificationNavigation";
import { getNotificationPref } from "../utils/notificationPreferences";
import { showSystemNotification } from "../utils/systemNotifications";

const vibrateIfEnabled = () => {
  if (!getNotificationPref("vibrate", true)) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
};

export const useNotificationAlerts = (notifications, isReady = false) => {
  const navigate = useNavigate();
  const seenIdsRef = useRef(new Set());
  const hasInitializedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  const alertForNotification = useCallback(
    (notification) => {
      const { title, content } = getNotificationContent(notification);
      const path = resolveNotificationPath(notification);
      const onNavigate = () => {
        if (path) navigate(path);
      };

      if (getNotificationPref("sound", true) && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      const tabHidden = typeof document !== "undefined" && document.hidden;

      if (!tabHidden) {
        toast.success(title, { description: content });
      } else {
        showSystemNotification({
          title,
          body: content,
          tag: `notification-${notification.id}`,
          onClick: onNavigate,
        });
      }

      vibrateIfEnabled();
    },
    [navigate],
  );

  useEffect(() => {
    if (!isReady) return;

    const list = Array.isArray(notifications) ? notifications : [];

    if (!hasInitializedRef.current) {
      list.forEach((notification) => seenIdsRef.current.add(notification.id));
      hasInitializedRef.current = true;
      return;
    }

    const newUnread = list.filter(
      (notification) =>
        notification.status === "UNREAD"
        && !seenIdsRef.current.has(notification.id),
    );

    list.forEach((notification) => seenIdsRef.current.add(notification.id));
    newUnread.forEach(alertForNotification);
  }, [notifications, alertForNotification, isReady]);
};
