import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/rbac";
import { toTimestamp } from "../../../shared/lib/activityTime";
import { CHAT_QUERY_KEYS } from "../../chat/constants/chatConstants";
import { fetchConversations } from "../../chat/services/chatApi";
import { getConvTitle } from "../../chat/utils/chatUtils";
import { useNotificationsQuery } from "../../notifications/hooks/useNotificationsQuery";
import {
  getNotificationContent,
  getUnreadCount,
} from "../../notifications/utils/notificationsUtils";

const TYPE_LABELS = {
  MATCH: "تطابقات",
  MESSAGE: "رسائل",
  PROJECT_INTEREST: "اهتمام بمشروع",
  SYSTEM: "نظام",
};

const asList = (value) => (Array.isArray(value) ? value : []);

export const useCommunicationHubData = () => {
  const { user } = useAuth();
  const canReadNotifications = hasPermission(user, "notifications.read");
  const canReadConversations = hasPermission(user, "conversations.read");

  const { data: notificationsRaw = [], isLoading: notificationsLoading } =
    useNotificationsQuery(canReadNotifications);

  const { data: conversationsRaw = [], isLoading: conversationsLoading } =
    useQuery({
      queryKey: CHAT_QUERY_KEYS.conversations,
      queryFn: fetchConversations,
      enabled: canReadConversations,
    });

  const notifications = asList(notificationsRaw);
  const conversations = asList(conversationsRaw);

  const unreadCount = canReadNotifications
    ? getUnreadCount(notifications)
    : null;

  const typeBreakdown = useMemo(() => {
    const counts = {};
    notifications.forEach((item) => {
      const key = item?.type || "OTHER";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        name: TYPE_LABELS[type] || type,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [notifications]);

  const recentNotifications = useMemo(
    () =>
      [...notifications]
        .sort(
          (a, b) =>
            (toTimestamp(b.createdAt) || 0) - (toTimestamp(a.createdAt) || 0),
        )
        .slice(0, 6)
        .map((item) => {
          const content = getNotificationContent(item);
          return {
            id: item.id,
            title: content.title,
            content: content.content,
            status: item.status,
            createdAt: item.createdAt,
            type: item.type,
          };
        }),
    [notifications],
  );

  const recentConversations = useMemo(
    () =>
      [...conversations]
        .sort((a, b) => {
          const aTime =
            toTimestamp(a.lastMessageAt) ||
            toTimestamp(a.lastMessage?.createdAt) ||
            toTimestamp(a.updatedAt) ||
            0;
          const bTime =
            toTimestamp(b.lastMessageAt) ||
            toTimestamp(b.lastMessage?.createdAt) ||
            toTimestamp(b.updatedAt) ||
            0;
          return bTime - aTime;
        })
        .slice(0, 6)
        .map((conv) => ({
          id: conv.id,
          title: getConvTitle(conv, user),
          kind: conv.team ? "فريق" : "خاصة",
          updatedAt:
            conv.lastMessageAt ||
            conv.lastMessage?.createdAt ||
            conv.updatedAt,
        })),
    [conversations, user],
  );

  const loading =
    (canReadNotifications && notificationsLoading) ||
    (canReadConversations && conversationsLoading);

  return {
    canReadNotifications,
    canReadConversations,
    loading,
    unreadCount,
    notificationsCount: canReadNotifications ? notifications.length : null,
    conversationsCount: canReadConversations ? conversations.length : null,
    messageNotificationsCount: canReadNotifications
      ? notifications.filter((n) => n.type === "MESSAGE").length
      : null,
    typeBreakdown,
    recentNotifications,
    recentConversations,
  };
};
