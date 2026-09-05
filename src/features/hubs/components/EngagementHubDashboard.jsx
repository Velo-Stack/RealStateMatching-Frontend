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
import { Crown, Gift, Medal, TrendUp } from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import CustomTooltip from "../../dashboard/components/CustomTooltip";
import { CHART_THEME_COLORS } from "../../dashboard/constants/dashboardConstants";
import {
  REASON_LABELS,
  TIER_LABELS,
  formatPoints,
  getProgressPercent,
} from "../../gamification/utils/gamificationFormatters";
import { useEngagementHubData } from "../hooks/useEngagementHubData";

const EngagementHubDashboard = ({ meta }) => {
  const {
    enabled,
    canRead,
    loading,
    balance,
    entries,
    tierData,
    rewards,
    leaderboard,
    myRank,
  } = useEngagementHubData();

  const theme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const chartColors = CHART_THEME_COLORS[theme];

  const GroupIcon = meta.icon;
  const tierLabel = TIER_LABELS[tierData?.tier] || "—";
  const nextRule = tierData?.nextRule;
  const progress = nextRule?.minPoints
    ? getProgressPercent(tierData?.balance ?? balance ?? 0, nextRule.minPoints)
    : 100;

  const chartData = useMemo(
    () =>
      leaderboard.slice(0, 8).map((row) => ({
        name: row.user?.name?.split(" ")[0] || `#${row.rank}`,
        points: Number(row.points) || 0,
        rank: row.rank,
      })),
    [leaderboard],
  );

  const recentEntries = entries.slice(0, 6);

  if (!enabled) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          نظام التحفيز غير مفعّل حالياً. يمكن تفعيله من إعدادات النظام.
        </p>
      </div>
    );
  }

  if (!canRead) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية عرض بيانات التحفيز.
        </p>
      </div>
    );
  }

  const stats = [
    {
      key: "balance",
      label: "رصيد النقاط",
      value: loading ? "..." : formatPoints(balance),
      icon: Medal,
    },
    {
      key: "tier",
      label: "المستوى الحالي",
      value: loading ? "..." : tierLabel,
      icon: TrendUp,
    },
    {
      key: "rewards",
      label: "المكافآت المتاحة",
      value: loading ? "..." : rewards.length,
      icon: Gift,
    },
    {
      key: "rank",
      label: "ترتيبي",
      value: loading ? "..." : myRank ? `#${myRank}` : "—",
      icon: Crown,
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
            نظرة عامة على نقاطك ومستواك وترتيبك بين الوسطاء
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
                <StatIcon size={16} weight="duotone" style={{ color: "var(--accent)" }} />
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

      {nextRule ? (
        <div className="depth-card p-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p
              className="text-sm font-semibold m-0"
              style={{ color: "var(--text-primary)" }}
            >
              التقدم نحو {TIER_LABELS[nextRule.toTier] || "المستوى التالي"}
            </p>
            <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>
              {progress}%
            </span>
          </div>
          <div
            className="h-2.5 rounded-full overflow-hidden"
            style={{ background: "var(--shell-nav-hover-bg)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "var(--gradient-accent)",
              }}
            />
          </div>
          {nextRule.minPoints ? (
            <p className="text-xs m-0 mt-2" style={{ color: "var(--text-dim)" }}>
              المطلوب: {formatPoints(nextRule.minPoints)} نقطة
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="أفضل المتصدرين"
            subtitle="أعلى النقاط حالياً"
            delay={0.05}
          >
            <div className="h-64 w-full" dir="ltr">
              {chartData.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  {loading ? "جاري التحميل..." : "لا توجد بيانات متصدرين بعد"}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: chartColors.tickPrimary, fontSize: 11 }}
                      axisLine={{ stroke: chartColors.axis }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartColors.tickSecondary, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Bar
                      dataKey="points"
                      name="النقاط"
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
            آخر حركات النقاط
          </h3>
          {recentEntries.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا توجد حركات حديثة"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {REASON_LABELS[entry.reason] || entry.reason || "حركة"}
                    </p>
                    <p className="text-[11px] m-0 mt-0.5" style={{ color: "var(--text-dim)" }}>
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString("ar-EG")
                        : "—"}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0"
                    style={{
                      color:
                        Number(entry.points) >= 0
                          ? "var(--success)"
                          : "var(--danger)",
                    }}
                  >
                    {Number(entry.points) >= 0 ? "+" : ""}
                    {formatPoints(entry.points)}
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

export default EngagementHubDashboard;
