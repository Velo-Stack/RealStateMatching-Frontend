import {
  Bell,
  ChatCircle,
  Gear,
  Handshake,
} from "phosphor-react";

const getScoreLabel = (score) => {
  if (score >= 80) return "ممتاز";
  if (score >= 60) return "جيد";
  if (score >= 40) return "متوسط";
  return "ضعيف";
};

export const getNotificationContent = (notification) => {
  const { type, match, meta } = notification;

  switch (type) {
    case "MATCH":
      if (match) {
        const score = meta?.score || match.score || 0;
        const scoreLabel = getScoreLabel(score);

        const offerType =
          match.offer?.type === "LAND"
            ? "أرض"
            : match.offer?.type === "PROJECT"
              ? "مشروع"
              : "مخطط";
        const city = match.offer?.city || match.request?.city || "";
        const usage = match.offer?.usage || match.request?.usage || "";

        // Determine if this is for offer owner or request owner
        const isOfferNotification = match.offer?.createdById === notification.userId;
        const targetType = isOfferNotification ? "لعرضك" : "لطلبك";

        return {
          title: `تطابق ${scoreLabel}! 🎉`,
          content: `تطابق بنسبة ${score}% ${targetType}${city ? ` في ${city}` : ""}${usage ? ` - ${usage}` : ""}`,
          icon: Handshake,
          iconColor: score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-violet-400",
          bgColor: score >= 80 ? "from-emerald-500/20 to-cyan-500/20" : score >= 60 ? "from-amber-500/20 to-yellow-500/20" : "from-violet-500/20 to-purple-500/20",
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
        iconColor: "text-amber-300",
        bgColor: "from-amber-500/20 to-yellow-500/18",
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
        iconColor: "text-amber-300",
        bgColor: "from-amber-500/20 to-yellow-500/18",
      };
  }
};

export const getUnreadCount = (notifications) =>
  notifications.filter((notification) => notification.status === "UNREAD").length;





