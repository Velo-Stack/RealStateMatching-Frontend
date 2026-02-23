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
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/18 border border-amber-500/35 flex items-center justify-center">
        <BellRinging size={24} className="text-amber-300" weight="duotone" />
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


