import { BellRinging } from "phosphor-react";
import NotificationsFilters from "./NotificationsFilters";

const NotificationsHeader = ({
  notificationsCount,
  unreadCount,
  readCount,
  filter,
  setFilter,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
        <BellRinging size={24} className="text-emerald-400" weight="duotone" />
      </div>
      <div>
        <p className="text-white font-semibold">{notificationsCount} تنبيه</p>
        <p className="text-sm text-slate-500">
          {unreadCount > 0 ? `${unreadCount} غير مقروء` : "جميعها مقروءة"}
        </p>
      </div>
    </div>

    <NotificationsFilters
      unreadCount={unreadCount}
      readCount={readCount}
      filter={filter}
      setFilter={setFilter}
    />
  </div>
);

export default NotificationsHeader;
