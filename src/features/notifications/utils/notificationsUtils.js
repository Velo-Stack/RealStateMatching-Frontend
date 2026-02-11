import {
  Bell,
  ChatCircle,
  Gear,
  Handshake,
} from "phosphor-react";

export const getNotificationContent = (notification) => {
  const { type, match, meta } = notification;

  switch (type) {
    case "MATCH":
      if (match) {
        const offerType =
          match.offer?.type === "LAND"
            ? "أرض"
            : match.offer?.type === "PROJECT"
              ? "مشروع"
              : "مخطط";
        const city = match.offer?.city || match.request?.city || "";

        return {
          title: "مطابقة جديدة! 🎉",
          content: `تم العثور على مطابقة بين عرض ${offerType} ${
            city ? `في ${city}` : ""
          } وطلب عميل`,
          icon: Handshake,
          iconColor: "text-violet-400",
          bgColor: "from-violet-500/20 to-purple-500/20",
        };
      }

      return {
        title: "مطابقة جديدة",
        content: "تم العثور على مطابقة جديدة",
        icon: Handshake,
        iconColor: "text-violet-400",
        bgColor: "from-violet-500/20 to-purple-500/20",
      };

    case "MESSAGE":
      return {
        title: "رسالة جديدة 💬",
        content: meta?.snippet || "لديك رسالة جديدة في المحادثات",
        icon: ChatCircle,
        iconColor: "text-cyan-400",
        bgColor: "from-cyan-500/20 to-blue-500/20",
      };

    case "SYSTEM":
      return {
        title: "إشعار النظام ⚙️",
        content: meta?.message || "إشعار من النظام",
        icon: Gear,
        iconColor: "text-amber-400",
        bgColor: "from-amber-500/20 to-orange-500/20",
      };

    default:
      return {
        title: "تنبيه",
        content: "لديك إشعار جديد",
        icon: Bell,
        iconColor: "text-emerald-400",
        bgColor: "from-emerald-500/20 to-cyan-500/20",
      };
  }
};

export const getUnreadCount = (notifications) =>
  notifications.filter((notification) => notification.status === "UNREAD").length;
