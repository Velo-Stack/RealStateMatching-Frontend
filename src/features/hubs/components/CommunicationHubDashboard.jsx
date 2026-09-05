import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bell, ChatCircle, EnvelopeSimple, UsersThree } from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import { useCommunicationHubData } from "../hooks/useCommunicationHubData";

const CommunicationHubDashboard = ({ meta }) => {
  const {
    canReadNotifications,
    canReadConversations,
    loading,
    unreadCount,
    notificationsCount,
    conversationsCount,
    messageNotificationsCount,
    typeBreakdown,
    recentNotifications,
    recentConversations,
  } = useCommunicationHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];
  const GroupIcon = meta.icon;

  const chartData = useMemo(
    () =>
      typeBreakdown.map((row) => ({
        name: row.name,
        count: row.count,
      })),
    [typeBreakdown],
  );

  if (!canReadNotifications && !canReadConversations) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية عرض بيانات التواصل.
        </p>
      </div>
    );
  }

  const displayValue = (value) => {
    if (loading && (value === null || value === undefined)) return "...";
    if (value === null || value === undefined) return "—";
    return value;
  };

  const stats = [
    {
      key: "unread",
      label: "تنبيهات غير مقروءة",
      value: displayValue(unreadCount),
      icon: Bell,
    },
    {
      key: "notifications",
      label: "إجمالي التنبيهات",
      value: displayValue(notificationsCount),
      icon: EnvelopeSimple,
    },
    {
      key: "conversations",
      label: "المحادثات",
      value: displayValue(conversationsCount),
      icon: UsersThree,
    },
    {
      key: "messages",
      label: "تنبيهات الرسائل",
      value: displayValue(messageNotificationsCount),
      icon: ChatCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 app-shell-control"
          style={{ color: "var(--accent)" }}
        >
          <GroupIcon size={24} weight="duotone" />
        </div>
        <div className="min-w-0">
          <h1
            className="text-xl lg:text-2xl font-bold m-0 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {meta.label}
          </h1>
          <p className="text-sm m-0 mt-1" style={{ color: "var(--text-dim)" }}>
            نظرة عامة على التنبيهات والمحادثات
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.key} className="depth-card p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p
                  className="text-[11px] m-0"
                  style={{ color: "var(--text-dim)" }}
                >
                  {stat.label}
                </p>
                <StatIcon
                  size={16}
                  weight="duotone"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <p
                className="text-xl lg:text-2xl font-bold m-0 truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="أنواع التنبيهات"
            subtitle="توزيع الإشعارات حسب النوع"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {!canReadNotifications ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  لا توجد صلاحية لعرض التنبيهات
                </div>
              ) : chartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد تنبيهات بعد"}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: chartColors.tickPrimary, fontSize: 11 }}
                      axisLine={{ stroke: chartColors.axis }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: chartColors.tickSecondary, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar
                      dataKey="count"
                      name="العدد"
                      fill={chartColors.emerald}
                      radius={[10, 10, 4, 4]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-2 depth-card p-5">
          <h3
            className="text-sm font-bold m-0 mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            آخر التنبيهات
          </h3>
          {!canReadNotifications ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              لا توجد صلاحية لعرض التنبيهات
            </p>
          ) : recentNotifications.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد تنبيهات حديثة"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </p>
                    {item.status === "UNREAD" ? (
                      <span
                        className="text-[10px] font-bold shrink-0"
                        style={{ color: "var(--accent)" }}
                      >
                        جديد
                      </span>
                    ) : null}
                  </div>
                  <p
                    className="text-[11px] m-0 mt-0.5 line-clamp-2"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="depth-card p-5">
        <h3
          className="text-sm font-bold m-0 mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          أحدث المحادثات
        </h3>
        {!canReadConversations ? (
          <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
            لا توجد صلاحية لعرض المحادثات
          </p>
        ) : recentConversations.length === 0 ? (
          <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
            {loading ? "جاري التحميل..." : "لا توجد محادثات بعد"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="rounded-xl px-3 py-3"
                style={{ background: "var(--shell-nav-hover-bg)" }}
              >
                <p
                  className="text-sm font-medium m-0 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {conv.title}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--accent)" }}
                  >
                    {conv.kind}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {conv.updatedAt
                      ? new Date(conv.updatedAt).toLocaleDateString("ar-EG")
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHubDashboard;
