import { SIDEBAR_GROUPS } from "../../../components/sidebar/sidebarNavConfig";
import { hasPermission } from "../../../utils/rbac";
import { useDashboardSummaryQuery } from "../../dashboard/hooks/useDashboardSummaryQuery";
import { useNotificationsQuery } from "../../notifications/hooks/useNotificationsQuery";
import { getUnreadCount } from "../../notifications/utils/notificationsUtils";

const formatValue = (value, loading) => {
  if (loading) return "...";
  if (value === null || value === undefined) return "—";
  return value;
};

/**
 * Lightweight hub stats from existing APIs only.
 * Fetches summary/notifications only when the current group needs them.
 */
export const useGroupHubStats = ({ groupId, user, visibleItemsCount }) => {
  const canSeeSummary = hasPermission(user, "dashboard.read");
  const canReadNotifications = hasPermission(user, "notifications.read");

  const needsSummary =
    groupId === SIDEBAR_GROUPS.OPERATIONS ||
    groupId === SIDEBAR_GROUPS.ADMIN;

  const needsNotifications = groupId === SIDEBAR_GROUPS.COMMUNICATION;

  const { data: summary, isLoading: summaryLoading } = useDashboardSummaryQuery(
    Boolean(needsSummary && canSeeSummary),
  );

  const { data: notifications = [], isLoading: notificationsLoading } =
    useNotificationsQuery(Boolean(needsNotifications && canReadNotifications));

  const unreadCount = getUnreadCount(
    Array.isArray(notifications) ? notifications : [],
  );

  const baseStats = [
    {
      key: "screens",
      label: "الشاشات المتاحة",
      value: visibleItemsCount,
    },
  ];

  if (groupId === SIDEBAR_GROUPS.OPERATIONS) {
    return {
      stats: [
        {
          key: "offers",
          label: "العروض",
          value: formatValue(summary?.offers, summaryLoading && canSeeSummary),
        },
        {
          key: "requests",
          label: "الطلبات",
          value: formatValue(
            summary?.requests,
            summaryLoading && canSeeSummary,
          ),
        },
        {
          key: "matches",
          label: "التطابقات",
          value: formatValue(
            summary?.matches,
            summaryLoading && canSeeSummary,
          ),
        },
        ...baseStats,
      ],
      loading: summaryLoading && canSeeSummary,
    };
  }

  if (groupId === SIDEBAR_GROUPS.COMMUNICATION) {
    return {
      stats: [
        {
          key: "unread",
          label: "تنبيهات غير مقروءة",
          value: formatValue(
            canReadNotifications ? unreadCount : null,
            notificationsLoading && canReadNotifications,
          ),
        },
        {
          key: "notifications",
          label: "إجمالي التنبيهات",
          value: formatValue(
            canReadNotifications
              ? Array.isArray(notifications)
                ? notifications.length
                : 0
              : null,
            notificationsLoading && canReadNotifications,
          ),
        },
        ...baseStats,
      ],
      loading: notificationsLoading && canReadNotifications,
    };
  }

  if (groupId === SIDEBAR_GROUPS.ADMIN) {
    return {
      stats: [
        {
          key: "offers",
          label: "العروض",
          value: formatValue(summary?.offers, summaryLoading && canSeeSummary),
        },
        {
          key: "requests",
          label: "الطلبات",
          value: formatValue(
            summary?.requests,
            summaryLoading && canSeeSummary,
          ),
        },
        ...baseStats,
      ],
      loading: summaryLoading && canSeeSummary,
    };
  }

  // tools / engagement / website / system — lightweight local stats
  return {
    stats: [
      ...baseStats,
      {
        key: "group",
        label: "الحالة",
        value: "جاهز",
      },
    ],
    loading: false,
  };
};
