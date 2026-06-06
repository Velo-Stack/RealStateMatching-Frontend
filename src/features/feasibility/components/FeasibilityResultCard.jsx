import { RISK_SEVERITY_STYLES } from "../constants/feasibilityConstants";

const FeasibilityResultCard = ({ outputs, studyId, onExport, exporting }) => {
  if (!outputs) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111827]/60 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">نتائج دراسة الجدوى</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          ["إجمالي الاستثمار", `${Number(outputs.totalInvestment).toLocaleString()} ر.س`],
          ["الربح المتوقع", `${Number(outputs.profit).toLocaleString()} ر.س`],
          ["العائد ROI", `${outputs.roi}%`],
          ["عائد كل مستثمر", `${Number(outputs.perInvestorReturn).toLocaleString()} ر.س`],
          ["فترة الاسترداد", `${outputs.paybackMonths} شهر`],
        ].map(([label, value]) => (
          <div key={label} className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-base font-bold text-emerald-400">{value}</p>
          </div>
        ))}
      </div>

      {outputs.riskFlags?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">مؤشرات المخاطر</p>
          <div className="flex flex-wrap gap-2">
            {outputs.riskFlags.map((flag) => (
              <span
                key={flag.code}
                className={`px-2 py-1 rounded text-xs border ${RISK_SEVERITY_STYLES[flag.severity] || RISK_SEVERITY_STYLES.MEDIUM}`}
              >
                {flag.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {studyId && onExport && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onExport(studyId)}
            disabled={exporting}
            className="px-4 py-2 rounded-lg text-sm bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 disabled:opacity-50"
          >
            {exporting ? "جاري التصدير..." : "تصدير PDF"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeasibilityResultCard;
