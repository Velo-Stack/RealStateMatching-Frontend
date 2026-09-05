import { Buildings, Clock, Handshake, MagnifyingGlass } from "phosphor-react";
import ChartCard from "../../dashboard/components/ChartCard";
import OffersRequestsActivityChart from "../../dashboard/components/OffersRequestsActivityChart";
import TopAreasChart from "../../dashboard/components/TopAreasChart";
import {
  formatDuration,
  getTopListTrend,
} from "../../dashboard/utils/dashboardUtils";
import { useOperationsHubData } from "../hooks/useOperationsHubData";

const formatGapValue = (gapMinutes, loading) => {
  if (loading) return "...";
  if (gapMinutes === null || gapMinutes === undefined) return "—";
  const parsedMinutes = Number(gapMinutes);
  if (!Number.isFinite(parsedMinutes)) return "—";
  return formatDuration(parsedMinutes * 60 * 1000);
};

const OperationsHubDashboard = ({ meta }) => {
  const {
    canSeeSummary,
    canSeeOffers,
    canSeeRequests,
    canSeeTopLists,
    isAdmin,
    loading,
    offersCount,
    requestsCount,
    matchesCount,
    offers,
    requests,
    offersLoading,
    requestsLoading,
    topAreas,
    areasLoading,
    activityGaps,
    activityGapsLoading,
    recentActivity,
  } = useOperationsHubData();

  const GroupIcon = meta.icon;
  const topAreasTrend = getTopListTrend(
    topAreas,
    (item) => item?._count?.id ?? 0,
  );

  if (!canSeeSummary && !canSeeOffers && !canSeeRequests) {
    return (
      <div className="depth-card p-8 text-center">
        <p className="m-0" style={{ color: "var(--text-secondary)" }}>
          ليس لديك صلاحية عرض بيانات العمليات.
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
      key: "offers",
      label: "العروض",
      value: displayValue(offersCount),
      icon: Buildings,
    },
    {
      key: "requests",
      label: "الطلبات",
      value: displayValue(requestsCount),
      icon: MagnifyingGlass,
    },
    {
      key: "matches",
      label: "التطابقات",
      value: displayValue(matchesCount),
      icon: Handshake,
    },
    {
      key: "gap",
      label: isAdmin ? "فاصل آخر عرضين" : "النشاط الأخير",
      value: isAdmin
        ? formatGapValue(
            activityGaps?.offerGapMinutes,
            activityGapsLoading,
          )
        : recentActivity.length
          ? recentActivity[0].type === "offer"
            ? "عرض"
            : "طلب"
          : loading
            ? "..."
            : "—",
      icon: Clock,
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
            نظرة عامة على العروض والطلبات والتطابقات
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

      {isAdmin && activityGaps ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key: "offerGap",
              label: "فاصل العروض",
              value: formatGapValue(
                activityGaps.offerGapMinutes,
                activityGapsLoading,
              ),
            },
            {
              key: "requestGap",
              label: "فاصل الطلبات",
              value: formatGapValue(
                activityGaps.requestGapMinutes,
                activityGapsLoading,
              ),
            },
            {
              key: "matchGap",
              label: "فاصل التطابقات",
              value: formatGapValue(
                activityGaps.matchGapMinutes,
                activityGapsLoading,
              ),
            },
          ].map((gap) => (
            <div key={gap.key} className="depth-card p-4">
              <p
                className="text-[11px] m-0"
                style={{ color: "var(--text-dim)" }}
              >
                {gap.label}
              </p>
              <p
                className="text-lg font-bold m-0 mt-1 truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {gap.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ChartCard
            title="نشاط العروض والطلبات"
            subtitle="متابعة الإضافات عبر الوقت"
            delay={0.05}
          >
            <OffersRequestsActivityChart
              offers={offers}
              requests={requests}
              loading={offersLoading || requestsLoading}
            />
          </ChartCard>
        </div>

        <div className="xl:col-span-2 depth-card p-5">
          <h3
            className="text-sm font-bold m-0 mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            آخر النشاط
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm m-0" style={{ color: "var(--text-dim)" }}>
              {loading ? "جاري التحميل..." : "لا يوجد نشاط حديث"}
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--shell-nav-hover-bg)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.label}
                    </p>
                    <p
                      className="text-[11px] m-0 mt-0.5"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("ar-EG")
                        : "—"}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    {row.type === "offer" ? "عرض" : "طلب"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {canSeeTopLists ? (
        <ChartCard
          title="أفضل المناطق"
          subtitle="حسب عدد العروض المتاحة"
          delay={0.1}
          trend={{
            direction: topAreasTrend.direction,
            label: String(topAreasTrend.delta),
          }}
        >
          <TopAreasChart topAreas={topAreas} areasLoading={areasLoading} />
        </ChartCard>
      ) : null}
    </div>
  );
};

export default OperationsHubDashboard;
