import { Clock } from "phosphor-react";

const NotificationDetailsPanel = ({ notification, title, content }) => (
  <div className="flex-1 min-w-0">
    <h4
      className={`text-sm font-semibold mb-0.5 ${
        notification.status === "UNREAD" ? "text-white" : "text-slate-300"
      }`}
    >
      {title}
    </h4>
    <p
      className={`text-sm mb-1 ${
        notification.status === "UNREAD" ? "text-slate-300" : "text-slate-500"
      }`}
    >
      {content}
    </p>
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <Clock size={12} />
      <span>{new Date(notification.createdAt).toLocaleString("ar-EG")}</span>
    </div>
  </div>
);

export default NotificationDetailsPanel;
