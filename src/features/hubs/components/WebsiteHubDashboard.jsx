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
  Buildings,
  ChartLineUp,
  Layout,
  Users,
} from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import { useWebsiteHubData } from "../hooks/useWebsiteHubData";

const WebsiteHubDashboard = ({ meta }) => {
  const {
    canManage,
    loading,
    projectsCount,
    activeProjects,
    totalInterests,
    activeSections,
    settingsPercent,
    siteName,
    interestChartData,
    topInterestProjects,
    recentProjects,
    moduleStatuses,
  } = useWebsiteHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];
  const GroupIcon = meta.icon;

  if (!canManage) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية إدارة محتوى الموقع.
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
      key: "projects",
      label: "المشاريع النشطة",
      value: loading
        ? "..."
        : `${displayValue(activeProjects)}/${displayValue(projectsCount)}`,
      icon: Buildings,
    },
    {
      key: "interests",
      label: "طلبات الاهتمام",
      value: displayValue(totalInterests),
      icon: Users,
    },
    {
      key: "sections",
      label: "أقسام مفعّلة",
      value: displayValue(activeSections),
      icon: Layout,
    },
    {
      key: "settings",
      label: "اكتمال الإعدادات",
      value: loading ? "..." : `${displayValue(settingsPercent)}%`,
      icon: ChartLineUp,
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
            {siteName
              ? `نظرة عامة على محتوى ${siteName}`
              : "نظرة عامة على محتوى الموقع الخارجي"}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {moduleStatuses.map((mod) => (
          <div key={mod.key} className="depth-card p-4">
            <p
              className="text-sm font-semibold m-0"
              style={{ color: "var(--text-primary)" }}
            >
              {mod.label}
            </p>
            <p className="text-xs m-0 mt-1" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : mod.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="الاهتمام بالمشاريع"
            subtitle="أعلى المشاريع حسب طلبات الاهتمام"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {interestChartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد طلبات اهتمام بعد"}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={interestChartData}
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
                      name="الاهتمام"
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
            أعلى المشاريع اهتماماً
          </h3>
          {topInterestProjects.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد طلبات اهتمام مسجّلة"}
            </p>
          ) : (
            <div className="space-y-3">
              {topInterestProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.title}
                    </p>
                    <p
                      className="text-[11px] m-0 mt-0.5"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {project.city}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    {project.interests} طلب
                  </span>
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
          أحدث المشاريع تحديثاً
        </h3>
        {recentProjects.length === 0 ? (
          <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
            {loading ? "جاري التحميل..." : "لا توجد مشاريع بعد"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl px-3 py-3"
                style={{ background: "var(--shell-nav-hover-bg)" }}
              >
                <p
                  className="text-sm font-medium m-0 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span
                    className="text-[11px]"
                    style={{
                      color: project.isActive
                        ? "var(--success)"
                        : "var(--text-dim)",
                    }}
                  >
                    {project.isActive ? "نشط" : "غير نشط"}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {project.updatedAt
                      ? new Date(project.updatedAt).toLocaleDateString("ar-EG")
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

export default WebsiteHubDashboard;
