import { useNotificationsData } from "../hooks/useNotificationsData";
import EmptyState from "./EmptyState";
import NotificationsHeader from "./NotificationsHeader";
import NotificationsList from "./NotificationsList";

const NotificationsPage = () => {
  const { notifications, isLoading, markRead, markAllRead, unreadCount } =
    useNotificationsData();

  if (isLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">جاري تحميل التنبيهات...</span>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <NotificationsHeader
        notificationsCount={notifications.length}
        unreadCount={unreadCount}
        markAllRead={markAllRead}
      />
      <NotificationsList
        notifications={notifications}
        markRead={markRead.mutate}
        isMarkReadPending={markRead.isPending}
      />
    </div>
  );
};

export default NotificationsPage;
