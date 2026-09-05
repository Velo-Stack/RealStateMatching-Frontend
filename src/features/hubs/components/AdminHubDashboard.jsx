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
import {
  Storefront,
  UserPlus,
  Users,
  UsersThree,
} from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import { useAdminHubData } from "../hooks/useAdminHubData";

const AdminHubDashboard = ({ meta }) => {
  const {
    canAccess,
    canReadUsers,
    canReadRegistrations,
    canReadJoinApps,
    loading,
    usersCount,
    teamsCount,
    officesCount,
    pendingRegistrationsCount,
    pendingJoinCount,
    roleChartData,
    recentPending,
  } = useAdminHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];
  const GroupIcon = meta.icon;

  const chartData = useMemo(
    () => roleChartData.filter((row) => row.count > 0),
    [roleChartData],
  );

  if (!canAccess) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية عرض بيانات الإدارة.
        </p>
      </div>
    );
  }

  const displayValue = (value) => {
    if (loading && (value === null || value === undefined)) return "...";
    if (value === null || value === undefined) return "—";
    return value;
  };

  const pendingQueue =
    (pendingRegistrationsCount || 0) + (pendingJoinCount || 0);

  const stats = [
    {
      key: "users",
      label: "المستخدمون",
      value: displayValue(usersCount),
      icon: Users,
    },
    {
      key: "teams",
      label: "الفرق",
      value: displayValue(teamsCount),
      icon: UsersThree,
    },
    {
      key: "offices",
      label: "المكاتب",
      value: displayValue(officesCount),
      icon: Storefront,
    },
    {
      key: "pending",
      label: "طلبات معلّقة",
      value:
        canReadRegistrations || canReadJoinApps
          ? loading
            ? "..."
            : pendingQueue
          : "—",
      icon: UserPlus,
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
            نظرة عامة على المستخدمين والفرق وطلبات المراجعة
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

      {(canReadRegistrations || canReadJoinApps) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {canReadRegistrations ? (
            <div className="depth-card p-4">
              <p
                className="text-[11px] m-0"
                style={{ color: "var(--text-dim)" }}
              >
                تسجيلات بانتظار الموافقة
              </p>
              <p
                className="text-lg font-bold m-0 mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {displayValue(pendingRegistrationsCount)}
              </p>
            </div>
          ) : null}
          {canReadJoinApps ? (
            <div className="depth-card p-4">
              <p
                className="text-[11px] m-0"
                style={{ color: "var(--text-dim)" }}
              >
                طلبات انضمام قيد المراجعة
              </p>
              <p
                className="text-lg font-bold m-0 mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {displayValue(pendingJoinCount)}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="توزيع الأدوار"
            subtitle="المستخدمون حسب الدور"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {!canReadUsers ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  لا توجد صلاحية لعرض المستخدمين
                </div>
              ) : chartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد بيانات مستخدمين"}
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
            طابور المراجعة
          </h3>
          {!canReadRegistrations && !canReadJoinApps ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              لا توجد صلاحية لعرض الطلبات المعلّقة
            </p>
          ) : recentPending.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد طلبات معلّقة"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentPending.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-[11px] m-0 mt-0.5"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                        : "—"}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    {item.kind}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHubDashboard;
