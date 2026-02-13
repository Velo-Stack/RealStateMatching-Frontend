import {
  Buildings,
  Clock,
  Handshake,
  Target,
  Timer,
  TrendUp,
} from "phosphor-react";
import { MiniStatCard } from "../../../components/common";
import { useMemo } from "react";
import { formatDuration, getActivityStats } from "../utils/matchesUtils";

const MatchesStats = ({ stats, matches }) => {
  const { lastMs, avgGapMs } = useMemo(
    () => getActivityStats(matches),
    [matches],
  );
  const lastValue =
    lastMs === null ? "غير متاح" : `منذ ${formatDuration(lastMs)}`;
  const avgValue = avgGapMs === null ? "غير متاح" : formatDuration(avgGapMs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <MiniStatCard
        label="إجمالي المطابقات"
        value={stats.total}
        icon={Handshake}
        gradient="violet"
      />
      <MiniStatCard
        label="مطابقات جديدة"
        value={stats.new}
        icon={Target}
        gradient="cyan"
        delay={0.1}
      />
      <MiniStatCard
        label="صفقات مغلقة"
        value={stats.closed}
        icon={Buildings}
        gradient="emerald"
        delay={0.2}
      />
      <MiniStatCard
        label="معدل التوافق"
        value={`${stats.avgScore}%`}
        icon={TrendUp}
        gradient="amber"
        delay={0.3}
      />
      <MiniStatCard
        label="آخر مطابقة"
        value={lastValue}
        icon={Clock}
        gradient="violet"
        delay={0.4}
      />
      <MiniStatCard
        label="متوسط الفاصل"
        value={avgValue}
        icon={Timer}
        gradient="cyan"
        delay={0.5}
      />
    </div>
  );
};

export default MatchesStats;
