import { Buildings, Target } from "phosphor-react";

const getScoreBadge = (score) => {
  if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "ممتاز", icon: "⭐" };
  if (score >= 60) return { bg: "bg-amber-500/20", text: "text-amber-400", label: "جيد", icon: "✓" };
  if (score >= 40) return { bg: "bg-orange-500/20", text: "text-orange-400", label: "متوسط", icon: "○" };
  return { bg: "bg-red-500/20", text: "text-red-400", label: "ضعيف", icon: "✗" };
};

const MatchItem = ({ row, type }) => {
  if (type === "offer") {
    return (
      <div className="text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
            <Buildings size={16} className="text-emerald-400" />
          </div>
          <span className="font-medium text-slate-200">{row.offer?.type || "-"}</span>
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
