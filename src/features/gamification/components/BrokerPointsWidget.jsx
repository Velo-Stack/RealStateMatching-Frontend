import { useQuery } from "@tanstack/react-query";
import { Trophy } from "phosphor-react";
import { Link } from "react-router-dom";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { fetchMyTier } from "../services/gamificationApi";
import { formatPoints } from "../utils/gamificationFormatters";
import BrokerTierBadge from "./BrokerTierBadge";

const BrokerPointsWidget = ({ user }) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("broker_points.enabled") || isFeatureEnabled("broker_tiers.enabled");
  const canRead = hasPermission(user, "brokers.points.read");

  const { data } = useQuery({
    queryKey: ["my-tier-widget"],
    queryFn: fetchMyTier,
    enabled: enabled && canRead,
    staleTime: 60_000,
  });

  if (!enabled || !canRead || !data) return null;

  const remaining =
    data.nextRule?.minPoints != null
      ? Math.max(0, data.nextRule.minPoints - data.balance)
      : null;

  return (
    <Link
      to="/app/my-points"
      className="block bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:border-emerald-500/20 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Trophy size={20} className="text-amber-400" />
          نقاطي
        </div>
        <BrokerTierBadge tier={data.tier} compact />
      </div>
      <p className="text-2xl font-bold text-emerald-400">{formatPoints(data.balance)} نقطة</p>
      {remaining != null && data.nextRule ? (
        <p className="text-sm text-slate-400 mt-2">
          {formatPoints(remaining)} نقطة للترقية التالية
        </p>
      ) : null}
    </Link>
  );
};

export default BrokerPointsWidget;
