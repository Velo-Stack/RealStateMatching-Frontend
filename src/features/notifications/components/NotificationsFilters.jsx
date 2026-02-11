import { motion } from "framer-motion";
import { CheckCircle } from "phosphor-react";

const NotificationsFilters = ({ unreadCount, markAllRead }) => {
  if (unreadCount <= 0) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => markAllRead.mutate()}
      disabled={markAllRead.isPending}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-2 hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-60"
    >
      <CheckCircle size={18} />
      تعليم الكل كمقروء
    </motion.button>
  );
};

export default NotificationsFilters;
