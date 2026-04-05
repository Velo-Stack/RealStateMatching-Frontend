import { Buildings, Target } from "phosphor-react";
import {
  PROPERTY_TYPES,
  USAGE_TYPES,
  getLabelByValue,
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

const formatType = (type) => getLabelByValue(PROPERTY_TYPES, type) || "غير محدد";
const formatUsage = (usage) => getLabelByValue(USAGE_TYPES, usage) || "غير محدد";

const getScoreBadge = (score) => {
  if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "ممتاز", icon: "⭐" };
  if (score >= 60) return { bg: "bg-amber-500/20", text: "text-amber-400", label: "جيد", icon: "✓" };
  if (score >= 40) return { bg: "bg-orange-500/20", text: "text-orange-400", label: "متوسط", icon: "○" };
  return { bg: "bg-red-500/20", text: "text-red-400", label: "ضعيف", icon: "✗" };
};

const MatchItem = ({ row, type }) => {
  if (type === "offer") {
    const offerAmount = formatCurrency(
      resolvePrimaryAmount(row.offer?.priceFrom, row.offer?.priceTo),
    );

    return (
<<<<<<< HEAD
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
          <Buildings size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">{formatType(row.offer?.type)}</p>
          <p className="text-xs text-slate-500">
            {formatUsage(row.offer?.usage)} • {row.offer?.city || "-"} • {offerAmount}
          </p>
=======
      <div className="text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
            <Buildings size={16} className="text-emerald-400" />
          </div>
          <span className="font-medium text-slate-200">{row.offer?.type || "-"}</span>
>>>>>>> development
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {row.offer?.city} - {row.offer?.district}
        </p>
        <p className="text-xs text-slate-500">
          {row.offer?.priceFrom
            ? Number(row.offer.priceFrom).toLocaleString() + " ج.م"
            : ""}
        </p>
      </div>
    );
  }

<<<<<<< HEAD
  const requestAmount = formatCurrency(
    resolvePrimaryAmount(row.request?.budgetFrom, row.request?.budgetTo),
  );

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
        <Target size={18} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">{formatType(row.request?.type)}</p>
        <p className="text-xs text-slate-500">
          {formatUsage(row.request?.usage)} • {row.request?.city || "-"} • {requestAmount}
=======
  if (type === "request") {
    return (
      <div className="text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <Target size={16} className="text-violet-400" />
          </div>
          <span className="font-medium text-slate-200">{row.request?.type || "-"}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {row.request?.city} - {row.request?.district}
        </p>
        <p className="text-xs text-slate-500">
          {row.request?.budgetFrom
            ? Number(row.request.budgetFrom).toLocaleString() + " ج.م"
            : ""}
>>>>>>> development
        </p>
      </div>
    );
  }

  // Score badge
  if (type === "score") {
    const score = row.score || 0;
    const badge = getScoreBadge(score);
    
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${badge.bg} border border-white/10`}>
          <span className="text-sm">{badge.icon}</span>
          <span className={`text-sm font-bold ${badge.text}`}>{score}%</span>
        </div>
        <span className={`text-xs ${badge.text}`}>{badge.label}</span>
      </div>
    );
  }

  return null;
};

export default MatchItem;
