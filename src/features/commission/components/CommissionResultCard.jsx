import { formatCurrency } from "../utils/commissionFormatters";

const Row = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className={highlight ? "font-bold text-emerald-400" : "font-medium text-white"}>
      {value}
    </span>
  </div>
);

const CommissionResultCard = ({ result, onSave, isSaving, showSave = true }) => {
  if (!result) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div>
        <h3 className="text-lg font-bold text-white">نتيجة الحساب</h3>
        {result.ruleName && (
          <p className="mt-1 text-xs text-slate-400">القاعدة: {result.ruleName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Row label="سعي البائع" value={formatCurrency(result.sellerCommission)} />
        <Row label="سعي المشتري" value={formatCurrency(result.buyerCommission)} />
        <Row label="إجمالي السعي" value={formatCurrency(result.totalCommission)} highlight />
        <Row label="ضريبة القيمة المضافة" value={formatCurrency(result.vatAmount)} />
        <Row label="الإجمالي شامل الضريبة" value={formatCurrency(result.grandTotal)} highlight />
        <Row label="نصيب كل وسيط" value={formatCurrency(result.perBroker)} />
      </div>

      {Array.isArray(result.brokerShares) && result.brokerShares.length > 0 && (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-right">الوسيط</th>
                <th className="px-3 py-2 text-right">النسبة</th>
                <th className="px-3 py-2 text-right">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {result.brokerShares.map((share) => (
                <tr key={share.index} className="border-t border-white/5">
                  <td className="px-3 py-2 text-white">#{share.index}</td>
                  <td className="px-3 py-2 text-slate-300">{share.sharePercent}%</td>
                  <td className="px-3 py-2 text-emerald-300">{formatCurrency(share.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSave && onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-60"
        >
          {isSaving ? "جاري الحفظ..." : "حفظ الحساب"}
        </button>
      )}
    </div>
  );
};

export default CommissionResultCard;
