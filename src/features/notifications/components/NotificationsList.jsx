import { AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";

const NotificationsList = ({ notifications, markRead, isMarkReadPending }) => (
  <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
    <AnimatePresence>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          markRead={markRead}
          isMarkReadPending={isMarkReadPending}
        />
      ))}
    </AnimatePresence>
  </div>
);

export default NotificationsList;
