import { useState } from "react";
import { SpeakerHigh, DeviceMobile, BellRinging } from "phosphor-react";
import {
  getNotificationPref,
  NOTIFICATION_PREF_KEYS,
  setNotificationPref,
} from "../utils/notificationPreferences";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "../utils/systemNotifications";

const TOGGLES = [
  {
    key: NOTIFICATION_PREF_KEYS.sound,
    label: "صوت الإشعار",
    icon: SpeakerHigh,
  },
  {
    key: NOTIFICATION_PREF_KEYS.system,
    label: "بانر نظام التشغيل",
    icon: BellRinging,
  },
  {
    key: NOTIFICATION_PREF_KEYS.vibrate,
    label: "اهتزاز (موبايل)",
    icon: DeviceMobile,
  },
];

const NotificationAlertSettings = () => {
  const [prefs, setPrefs] = useState(() => ({
    sound: getNotificationPref("sound", true),
    system: getNotificationPref("system", true),
    vibrate: getNotificationPref("vibrate", true),
  }));
  const [permission, setPermission] = useState(() => getNotificationPermission());

  const handleToggle = (key) => {
    const next = !prefs[key];
    setNotificationPref(key, next);
    setPrefs((current) => ({ ...current, [key]: next }));
  };

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#111827]/60 backdrop-blur-xl p-4 space-y-3">
      <p className="text-sm font-medium text-white m-0">إعدادات التنبيهات</p>
      <div className="space-y-2">
        {TOGGLES.map(({ key, label, icon: Icon }) => (
          <label
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Icon size={16} className="text-amber-300" />
              {label}
            </span>
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={() => handleToggle(key)}
              className="h-4 w-4 accent-amber-500"
            />
          </label>
        ))}
      </div>
      {permission !== "granted" && (
        <button
          type="button"
          onClick={handleRequestPermission}
          className="w-full h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-200 text-sm hover:bg-amber-500/25 transition-colors"
        >
          {permission === "denied"
            ? "الإذن محظور — فعّله من إعدادات المتصفح"
            : "تفعيل إذن إشعارات النظام"}
        </button>
      )}
    </div>
  );
};

export default NotificationAlertSettings;
