import { motion } from "framer-motion";
import { Check, CheckCircle } from "phosphor-react";
import { getNotificationContent } from "../utils/notificationsUtils";
import NotificationDetailsPanel from "./NotificationDetailsPanel";

const NotificationItem = ({ notification, index, markRead, isMarkReadPending }) => {
  const { title, content, icon: Icon, iconColor, bgColor } =
    getNotificationContent(notification);

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative px-5 py-4 flex items-start justify-between gap-4 border-b border-white/5 last:border-0 transition-all duration-300 ${
        notification.status === "UNREAD"
          ? "bg-gradient-to-l from-emerald-500/5 to-transparent"
          : "hover:bg-white/[0.02]"
      }`}
    >
      {notification.status === "UNREAD" && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
      )}

      <div
        className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br ${bgColor}`}
      >
        <Icon size={18} className={iconColor} weight="duotone" />
      </div>

      <NotificationDetailsPanel
        notification={notification}
        title={title}
        content={content}
      />

      {notification.status === "UNREAD" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          disabled={isMarkReadPending}
          onClick={() => markRead(notification.id)}
          className="shrink-0 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-60"
        >
          <Check size={14} />
          مقروء
        </motion.button>
      )}

      {notification.status === "READ" && (
        <span className="shrink-0 flex items-center gap-1 text-xs text-slate-600">
          <CheckCircle size={14} weight="fill" />
          تمت القراءة
        </span>
      )}
    </motion.div>
  );
};

export default NotificationItem;
