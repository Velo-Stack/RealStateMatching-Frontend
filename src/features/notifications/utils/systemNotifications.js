import { getNotificationPref } from "./notificationPreferences";

const NOTIFICATION_ICON = "/logo-black.png";

export const isNotificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "denied";
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
};

export const showSystemNotification = ({ title, body, tag, onClick }) => {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== "granted") return null;
  if (!getNotificationPref("system", true)) return null;

  const notification = new Notification(title, {
    body,
    tag: tag || `rwasikh-${Date.now()}`,
    icon: NOTIFICATION_ICON,
  });

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    notification.close();
    onClick?.();
  };

  return notification;
};
