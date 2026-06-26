const PREFIX = "notifications.";

export const NOTIFICATION_PREF_KEYS = {
  sound: "sound",
  system: "system",
  vibrate: "vibrate",
};

export const getNotificationPref = (key, defaultValue = true) => {
  const stored = localStorage.getItem(`${PREFIX}${key}`);
  if (stored === null) return defaultValue;
  return stored === "true";
};

export const setNotificationPref = (key, value) => {
  localStorage.setItem(`${PREFIX}${key}`, String(Boolean(value)));
};
