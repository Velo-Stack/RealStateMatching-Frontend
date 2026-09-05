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
  Calculator,
  ChartPieSlice,
  CheckCircle,
  Mountains,
} from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import { useToolsHubData } from "../hooks/useToolsHubData";

const ToolsHubDashboard = ({ meta }) => {
  const {
    canAccess,
    canComparables,
    loading,
    enabledToolsCount,
    rulesCount,
    templatesCount,
    comparablesCount,
    verifiedComparables,
    cityChartData,
    recentComparables,
    toolStatuses,
    defaultTemplate,
  } = useToolsHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];
  const GroupIcon = meta.icon;

  const chartData = useMemo(() => cityChartData, [cityChartData]);

  if (!canAccess) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليست لديك أدوات متاحة حالياً، أو الميزات غير مفعّلة.
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
      key: "tools",
      label: "أدوات متاحة",
      value: displayValue(enabledToolsCount),
      icon: CheckCircle,
    },
    {
      key: "templates",
      label: "قوالب الجدوى",
      value: displayValue(templatesCount),
      icon: ChartPieSlice,
    },
    {
      key: "comparables",
      label: "صفقات المقارنة",
      value: displayValue(comparablesCount),
      icon: Mountains,
    },
    {
      key: "rules",
      label: rulesCount !== null ? "قواعد السعي" : "صفقات موثّقة",
      value:
        rulesCount !== null
          ? displayValue(rulesCount)
          : displayValue(verifiedComparables),
      icon: Calculator,
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
            نظرة عامة على حاسبة السعي والجدوى وصفقات المقارنة
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {toolStatuses.map((tool) => (
          <div key={tool.key} className="depth-card p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p
                className="text-sm font-semibold m-0"
                style={{ color: "var(--text-primary)" }}
              >
                {tool.label}
              </p>
              <span
                className="text-[10px] font-bold"
                style={{
                  color: tool.available ? "var(--success)" : "var(--text-dim)",
                }}
              >
                {tool.available ? "متاحة" : "غير متاحة"}
              </span>
            </div>
            <p className="text-xs m-0" style={{ color: "var(--text-dim)" }}>
              {loading && tool.available ? "جاري التحميل..." : tool.detail}
            </p>
            {tool.key === "feasibility" && defaultTemplate ? (
              <p
                className="text-[11px] m-0 mt-2 truncate"
                style={{ color: "var(--accent)" }}
              >
                القالب الافتراضي: {defaultTemplate.name || defaultTemplate.title || "—"}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="صفقات المقارنة حسب المدينة"
            subtitle="توزيع بيانات الأراضي"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {!canComparables ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  صفقات المقارنة غير متاحة لحسابك
                </div>
              ) : chartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد صفقات مقارنة بعد"}
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
            أحدث صفقات المقارنة
          </h3>
          {!canComparables ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              استخدم التبويبات أعلاه لفتح الأدوات المتاحة
            </p>
          ) : recentComparables.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد صفقات حديثة"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentComparables.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.city}
                    </p>
                    <span
                      className="text-[10px] font-bold shrink-0"
                      style={{ color: "var(--accent)" }}
                    >
                      {row.source}
                    </span>
                  </div>
                  <p
                    className="text-[11px] m-0 mt-0.5"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {row.areaM2 ? `${row.areaM2} م²` : "—"}
                    {row.pricePerM2
                      ? ` · ${Number(row.pricePerM2).toLocaleString("ar-EG")} ر.س/م²`
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsHubDashboard;
