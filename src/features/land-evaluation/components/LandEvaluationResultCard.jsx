import { CONFIDENCE_LABELS } from "../constants/landEvaluationConstants";

const CONFIDENCE_BADGE = {
  LOW: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  HIGH: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const LandEvaluationResultCard = ({ evaluation }) => {
  if (!evaluation) return null;

  const conf = CONFIDENCE_LABELS[evaluation.confidence] || CONFIDENCE_LABELS.LOW;
  const badgeClass = CONFIDENCE_BADGE[evaluation.confidence] || CONFIDENCE_BADGE.LOW;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111827]/60 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-slate-200">نتيجة تقدير السعر</h3>
        <span className={`px-2 py-1 rounded text-xs border ${badgeClass}`}>
          ثقة {conf.label} ({evaluation.comparableCount} مقارنة)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
          <p className="text-xs text-slate-400 mb-1">الحد الأدنى</p>
          <p className="text-lg font-bold text-emerald-400">{Number(evaluation.estimatedMin).toLocaleString()} ر.س</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
          <p className="text-xs text-slate-400 mb-1">سعر الم² (وسيط)</p>
          <p className="text-lg font-bold text-cyan-400">{Number(evaluation.medianPricePerM2).toLocaleString()} ر.س</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
          <p className="text-xs text-slate-400 mb-1">الحد الأعلى</p>
          <p className="text-lg font-bold text-emerald-400">{Number(evaluation.estimatedMax).toLocaleString()} ر.س</p>
        </div>
      </div>
    </div>
  );
};

export default LandEvaluationResultCard;
