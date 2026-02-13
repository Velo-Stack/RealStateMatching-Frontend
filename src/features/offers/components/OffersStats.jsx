import { useMemo } from "react";
import { Clock, Timer } from "phosphor-react";
import { MiniStatCard } from "../../../components/common";
import { formatDuration, getActivityStats } from "../utils/offersUtils";

const OffersStats = ({ offers }) => {
  const { lastMs, avgGapMs } = useMemo(
    () => getActivityStats(offers),
    [offers],
  );

  const lastValue =
    lastMs === null ? "غير متاح" : `منذ ${formatDuration(lastMs)}`;
  const avgValue = avgGapMs === null ? "غير متاح" : formatDuration(avgGapMs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MiniStatCard
        label="آخر عرض"
        value={lastValue}
        icon={Clock}
        gradient="emerald"
      />
      <MiniStatCard
        label="متوسط الفاصل"
        value={avgValue}
        icon={Timer}
        gradient="cyan"
        delay={0.1}
      />
    </div>
  );
};

export default OffersStats;
