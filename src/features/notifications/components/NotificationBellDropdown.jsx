import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "phosphor-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotificationContent } from "../utils/notificationsUtils";
import { resolveNotificationPath } from "../utils/notificationNavigation";
import { markNotificationRead } from "../services/notificationsApi";

const NotificationBellDropdown = ({ notifications = [], unreadCount = 0 }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const recentNotifications = notifications.slice(0, 5);

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (notification) => {
    if (notification.status === "UNREAD") {
      markRead.mutate(notification.id);
    }
    const path = resolveNotificationPath(notification);
    setOpen(false);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="التنبيهات"
        className="relative h-9 w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -left-1 min-w-[18px] h-[18px] lg:min-w-[20px] lg:h-5 rounded-full bg-red-500 text-white text-[9px] lg:text-[10px] font-bold flex items-center justify-center px-1 shadow-lg shadow-red-500/35"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#0d1117]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white m-0">آخر التنبيهات</p>
              <Link
                to="/app/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                عرض الكل
              </Link>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-500 m-0">
                  لا توجد تنبيهات
                </p>
              ) : (
                recentNotifications.map((notification) => {
                  const { title, content, icon: Icon, iconColor } =
                    getNotificationContent(notification);
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleItemClick(notification)}
                      className={`w-full text-right px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors ${
                        notification.status === "UNREAD" ? "bg-amber-500/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white m-0 truncate">{title}</p>
                          <p className="text-xs text-slate-400 m-0 mt-1 line-clamp-2">{content}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBellDropdown;
