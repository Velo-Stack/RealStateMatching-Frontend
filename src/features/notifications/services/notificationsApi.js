import api from "../../../utils/api";

export const fetchNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}`, { status: "READ" });
  return data;
};

export const markAllNotificationsRead = async (notifications) => {
  const unread = notifications.filter(
    (notification) => notification.status === "UNREAD",
  );
  await Promise.all(
    unread.map((notification) =>
      api.patch(`/notifications/${notification.id}`, { status: "READ" }),
    ),
  );
};
