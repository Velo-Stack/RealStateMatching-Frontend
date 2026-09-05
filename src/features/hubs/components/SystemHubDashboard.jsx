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
  CreditCard,
  FileArrowDown,
  Gear,
  Scroll,
} from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import { useSystemHubData } from "../hooks/useSystemHubData";

const SystemHubDashboard = ({ meta }) => {
  const {
    canAccess,
    canAudit,
    loading,
    auditStats,
    actionChartData,
    recentAudit,
    enabledFlagsCount,
    totalFlagsCount,
    reportTypesCount,
    planCode,
    plansCount,
    subscriptionEnd,
    moduleStatuses,
  } = useSystemHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];
  const GroupIcon = meta.icon;

  if (!canAccess) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية عرض بيانات النظام.
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
      key: "audit",
      label: "عمليات التدقيق",
      value: canAudit ? displayValue(auditStats.total) : "—",
      icon: Scroll,
    },
    {
      key: "reports",
      label: "أنواع التقارير",
      value: displayValue(reportTypesCount),
      icon: FileArrowDown,
    },
    {
      key: "flags",
      label: "ميزات مفعّلة",
      value:
        totalFlagsCount != null
          ? loading
            ? "..."
            : `${enabledFlagsCount}/${totalFlagsCount}`
          : "—",
      icon: Gear,
    },
    {
      key: "plan",
      label: "خطة الاشتراك",
      value: displayValue(planCode),
      icon: CreditCard,
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
            نظرة عامة على التقارير والتدقيق والإعدادات والاشتراك
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

      {canAudit ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "creates", label: "إنشاء", value: auditStats.creates },
            { key: "updates", label: "تحديث", value: auditStats.updates },
            { key: "deletes", label: "حذف", value: auditStats.deletes },
          ].map((item) => (
            <div key={item.key} className="depth-card p-4">
              <p
                className="text-[11px] m-0"
                style={{ color: "var(--text-dim)" }}
              >
                {item.label}
              </p>
              <p
                className="text-lg font-bold m-0 mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {loading ? "..." : item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {moduleStatuses.map((mod) => (
          <div key={mod.key} className="depth-card p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p
                className="text-sm font-semibold m-0"
                style={{ color: "var(--text-primary)" }}
              >
                {mod.label}
              </p>
              <span
                className="text-[10px] font-bold"
                style={{
                  color: mod.available ? "var(--success)" : "var(--text-dim)",
                }}
              >
                {mod.available ? "متاح" : "غير متاح"}
              </span>
            </div>
            <p className="text-xs m-0" style={{ color: "var(--text-dim)" }}>
              {loading && mod.available ? "جاري التحميل..." : mod.detail}
            </p>
            {mod.key === "subscription" && subscriptionEnd ? (
              <p
                className="text-[11px] m-0 mt-2"
                style={{ color: "var(--accent)" }}
              >
                ينتهي {new Date(subscriptionEnd).toLocaleDateString("ar-EG")}
                {plansCount != null ? ` · ${plansCount} خطط` : ""}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="توزيع عمليات التدقيق"
            subtitle="حسب نوع العملية"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {!canAudit ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  لا توجد صلاحية لعرض سجلات التدقيق
                </div>
              ) : actionChartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد سجلات بعد"}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={actionChartData}
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
            أحدث العمليات
          </h3>
          {!canAudit ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              استخدم التبويبات أعلاه لفتح شاشات النظام المتاحة
            </p>
          ) : recentAudit.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد عمليات حديثة"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentAudit.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <p
                    className="text-sm font-medium m-0 truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span
                      className="text-[11px] truncate"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {item.userName}
                    </span>
                    <span
                      className="text-[11px] shrink-0"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHubDashboard;
