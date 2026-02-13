import { motion } from "framer-motion";

const NotificationsFilters = ({ filter, setFilter, unreadCount, readCount }) => (
  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-1">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setFilter("UNREAD")}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
        filter === "UNREAD"
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "text-slate-400 hover:text-emerald-300"
      }`}
    >
      غير مقروء ({unreadCount})
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setFilter("READ")}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
        filter === "READ"
          ? "bg-white/10 text-white border border-white/10"
          : "text-slate-400 hover:text-white"
      }`}
    >
      مقروء ({readCount})
    </motion.button>
  </div>
);

export default NotificationsFilters;
