import { Buildings, Target } from "phosphor-react";
import {
  PROPERTY_TYPES,
  USAGE_TYPES,
  getLabelByValue,
  getPropertySubTypeLabel,
} from "../../../constants/enums";

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const resolvePrimaryAmount = (fromValue, toValue) => {
  const from = toNumber(fromValue);
  const to = toNumber(toValue);
  return from ?? to;
};

const formatCurrency = (value) => {
  const parsed = toNumber(value);
  if (parsed === null) return "-";
  return `${parsed.toLocaleString("ar-EG")} ر.س`;
};

const formatType = (usage, propertySubType, type) =>
  getPropertySubTypeLabel(usage, propertySubType) || getLabelByValue(PROPERTY_TYPES, type) || "غير محدد";

const formatUsage = (usage) =>
  getLabelByValue(USAGE_TYPES, usage) || "غير محدد";

const getScoreBadge = (score) => {
  if (score >= 80) {
    return {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      label: "ممتاز",
      icon: "⭐",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      label: "جيد",
      icon: "✓",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      label: "متوسط",
      icon: "○",
    };
  }
  return {
    bg: "bg-red-500/20",
    text: "text-red-400",
    label: "ضعيف",
    icon: "✗",
  };
};

const MatchItem = ({ row, type }) => {
  if (type === "offer") {
    const offerAmount = formatCurrency(
      resolvePrimaryAmount(row.offer?.priceFrom, row.offer?.priceTo),
    );

    return (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
          <Buildings size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {formatType(row.offer?.usage, row.offer?.propertySubType, row.offer?.type)}
          </p>
          <p className="text-xs text-slate-500">
            {formatUsage(row.offer?.usage)} • {row.offer?.cityRel?.name || row.offer?.city || "-"} •{" "}
            {offerAmount}
          </p>
        </div>
      </div>
    );
  }

  if (type === "request") {
    const requestAmount = formatCurrency(
      resolvePrimaryAmount(row.request?.budgetFrom, row.request?.budgetTo),
    );

    return (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
          <Target size={18} className="text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {formatType(row.request?.usage, row.request?.propertySubType, row.request?.type)}
          </p>
          <p className="text-xs text-slate-500">
            {formatUsage(row.request?.usage)} • {row.request?.cityRel?.name || row.request?.city || "-"} •{" "}
            {requestAmount}
          </p>
        </div>
      </div>
    );
  }

  if (type === "score") {
    const rawScore = toNumber(row.score);
    const scorePercent = rawScore === null ? 0 : rawScore <= 1 ? rawScore * 100 : rawScore;
    const score = Math.max(0, Math.min(scorePercent, 100));
    const badge = getScoreBadge(score);

    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 ${badge.bg}`}
        >
          <span className="text-sm">{badge.icon}</span>
          <span className={`text-sm font-bold ${badge.text}`}>{score.toFixed(1)}%</span>
        </div>
        <span className={`text-xs ${badge.text}`}>{badge.label}</span>
      </div>
    );
  }

  return null;
};

export default MatchItem;
