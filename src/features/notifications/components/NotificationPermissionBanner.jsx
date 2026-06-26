import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, X } from "phosphor-react";
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
} from "../utils/systemNotifications";

const DISMISS_KEY = "notifications.permissionBannerDismissed";

const NotificationPermissionBanner = () => {
  const [permission, setPermission] = useState(() => getNotificationPermission());
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "true",
  );
  const [requesting, setRequesting] = useState(false);

  if (!isNotificationSupported() || permission === "granted" || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    setRequesting(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setRequesting(false);
    if (result === "granted") {
      localStorage.setItem(DISMISS_KEY, "true");
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 lg:mx-6 mt-3 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 px-4 py-3 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Bell size={18} className="text-amber-300" weight="duotone" />
        </div>
        <p className="text-sm text-slate-200 m-0">
          فعّل إشعارات النظام لتصلك التنبيهات حتى عند فتح تبويب آخر
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleEnable}
          disabled={requesting || permission === "denied"}
          className="h-8 px-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-5 text-xs font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50"
        >
          {requesting ? "جاري الطلب..." : permission === "denied" ? "محظور من المتصفح" : "تفعيل"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="إخفاء"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPermissionBanner;
