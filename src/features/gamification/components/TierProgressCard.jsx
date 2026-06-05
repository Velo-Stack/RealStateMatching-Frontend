import BrokerTierBadge from "./BrokerTierBadge";
import { formatPoints, getProgressPercent, TIER_LABELS } from "../utils/gamificationFormatters";

const TierProgressCard = ({ tierData }) => {
  if (!tierData) return null;

  const { tier, balance, closedDeals, mediationOffers, nextRule } = tierData;
  const isMaxTier = !nextRule;

  const pointsTarget = nextRule?.minPoints;
  const dealsTarget = nextRule?.minClosedDeals;
  const mediationTarget = nextRule?.minMediationOffers;

  return (
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-slate-400 text-sm">مستواك الحالي</p>
          <div className="mt-2">
            <BrokerTierBadge tier={tier} />
          </div>
        </div>
        <div className="text-left">
          <p className="text-slate-400 text-sm">رصيد النقاط</p>
          <p className="text-2xl font-bold text-emerald-400">{formatPoints(balance)}</p>
        </div>
      </div>

      {isMaxTier ? (
        <p className="text-sm text-amber-300">وصلت لأعلى مستوى — وسيط النخبة 🥇</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            الترقية التالية:{" "}
            <span className="text-white font-medium">
              {TIER_LABELS[nextRule.toTier] || nextRule.toTier}
            </span>
          </p>

          {pointsTarget != null ? (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>النقاط</span>
                <span>
                  {formatPoints(balance)} / {formatPoints(pointsTarget)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${getProgressPercent(balance, pointsTarget)}%` }}
                />
              </div>
            </div>
          ) : null}

          {dealsTarget != null ? (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>صفقات مغلقة</span>
                <span>
                  {closedDeals} / {dealsTarget}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${getProgressPercent(closedDeals, dealsTarget)}%` }}
                />
              </div>
            </div>
          ) : null}

          {mediationTarget != null ? (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>عروض وساطة</span>
                <span>
                  {mediationOffers} / {mediationTarget}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${getProgressPercent(mediationOffers, mediationTarget)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TierProgressCard;
