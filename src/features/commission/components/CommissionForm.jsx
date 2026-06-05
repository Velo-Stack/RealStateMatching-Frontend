import { CONTRACT_TYPE_OPTIONS, EXCLUSIVITY_OPTIONS } from "../../../constants/enums";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white focus:border-emerald-500/40 focus:outline-none";
const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

const CommissionForm = ({ form, onChange, onSubmit, isCalculating }) => (
  <form onSubmit={onSubmit} className="space-y-4 text-right">
    <div>
      <label className={labelClasses}>سعر البيع (ريال)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        className={inputClasses}
        dir="ltr"
        value={form.salePrice}
        onChange={(e) => onChange("salePrice", e.target.value)}
        required
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>طبيعة التعاقد</label>
        <select
          className={inputClasses}
          value={form.contractType}
          onChange={(e) => onChange("contractType", e.target.value)}
        >
          {CONTRACT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClasses}>الحصرية</label>
        <select
          className={inputClasses}
          value={form.exclusivity}
          onChange={(e) => onChange("exclusivity", e.target.value)}
        >
          {EXCLUSIVITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className={labelClasses}>عدد الوسطاء</label>
      <input
        type="number"
        min="1"
        max="10"
        className={inputClasses}
        dir="ltr"
        value={form.brokerCount}
        onChange={(e) => onChange("brokerCount", e.target.value)}
        required
      />
    </div>

    <button
      type="submit"
      disabled={isCalculating}
      className="theme-button-primary w-full rounded-xl py-3 text-sm font-bold disabled:opacity-60"
    >
      {isCalculating ? "جاري الحساب..." : "احسب السعي"}
    </button>
  </form>
);

export default CommissionForm;
