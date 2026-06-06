import { CONTRACT_TYPE_OPTIONS, EXCLUSIVITY_OPTIONS } from "../../../constants/enums";
import FormattedNumberInput from "../../../components/common/FormattedNumberInput";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-[#111827]/60 px-4 py-2.5 text-sm text-white focus:border-emerald-500/40 focus:outline-none";
const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

const CommissionForm = ({ form, onChange, onSubmit, isCalculating }) => (
  <form onSubmit={onSubmit} className="space-y-4 text-right">
    <div>
      <FormattedNumberInput
        label="سعر البيع (ريال)"
        name="salePrice"
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
      <FormattedNumberInput
        label="عدد الوسطاء"
        name="brokerCount"
        dir="ltr"
        value={form.brokerCount}
        onChange={(e) => onChange("brokerCount", e.target.value)}
        maxDigits={2}
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
