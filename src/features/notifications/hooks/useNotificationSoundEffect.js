import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { NOTIFICATION_SOUND_URL } from "../constants/notificationsConstants";
import { getUnreadCount } from "../utils/notificationsUtils";

export const useNotificationSoundEffect = (notifications) => {
  const prevUnreadCountRef = useRef(0);
  const hasInitializedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const unreadCount = getUnreadCount(notifications);

    // Skip alert only for the first loaded snapshot.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevUnreadCountRef.current = unreadCount;
      return;
    }

    if (unreadCount > prevUnreadCountRef.current) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors (browser may block)
        });
      }

      toast.success("لديك إشعارات جديدة! 🔔");
    }

    prevUnreadCountRef.current = unreadCount;
  }, [notifications]);
};
