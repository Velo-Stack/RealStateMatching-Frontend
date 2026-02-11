import { Buildings, Handshake, Target, TrendUp } from "phosphor-react";
import { MiniStatCard } from "../../../components/common";

const MatchesStats = ({ stats }) => (
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
  </div>
);

export default MatchesStats;
