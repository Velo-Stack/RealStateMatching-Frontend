import { TIER_ICONS, TIER_LABELS } from "../utils/gamificationFormatters";

const tierStyles = {
  REGULAR: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  SKILLED: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  ELITE: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

const BrokerTierBadge = ({ tier = "REGULAR", compact = false }) => {
  if (!tier) return null;
  const label = TIER_LABELS[tier] || tier;
  const icon = TIER_ICONS[tier] || "";
  const style = tierStyles[tier] || tierStyles.REGULAR;

  if (compact) {
    return (
      <span className="text-sm" title={label}>
        {icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${style}`}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
};

export default BrokerTierBadge;
