import { useState, useEffect } from "react";
import { Calculator } from "phosphor-react";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import CommissionForm from "./CommissionForm";
import CommissionResultCard from "./CommissionResultCard";
import { useCommissionCalculate } from "../hooks/useCommissionCalculate";
import { parseFormattedNumber } from "../../../utils/numberFormatting";

const EMPTY_FORM = {
  salePrice: "",
  contractType: "WITH_MEDIATION_CONTRACT",
  exclusivity: "NON_EXCLUSIVE",
  brokerCount: 1,
};

const CommissionCalculatorPage = ({
  initialForm = null,
  offerId = null,
  embedded = false,
  onSaved,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled("commission_calculator.enabled");

  const [form, setForm] = useState(initialForm || EMPTY_FORM);
  const [result, setResult] = useState(null);
  const { calculate, save } = useCommissionCalculate();

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      setResult(null);
    }
  }, [initialForm]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => ({
    salePrice: parseFormattedNumber(form.salePrice),
    contractType: form.contractType,
    exclusivity: form.exclusivity,
    brokerCount: parseFormattedNumber(form.brokerCount) || 1,
  });

  const handleCalculate = (e) => {
    e.preventDefault();
    calculate.mutate(buildPayload(), {
      onSuccess: (data) => setResult(data.result),
    });
  };

  const handleSave = () => {
    if (!result) return;
    save.mutate(
      {
        ...buildPayload(),
        offerId,
      },
      { onSuccess: () => onSaved?.() }
    );
  };

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#111827]/60 p-8 text-center text-slate-400">
        حاسبة السعي غير مفعّلة. يمكن للمسؤول تفعيلها من إعدادات النظام.
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      {!embedded && (
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator size={28} className="text-emerald-400" />
            حاسبة السعي
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            احسب عمولة الوساطة وتوزيعها على الوسطاء
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-[#111827]/60 p-5">
          <CommissionForm
            form={form}
            onChange={handleChange}
            onSubmit={handleCalculate}
            isCalculating={calculate.isPending}
          />
        </div>
        <CommissionResultCard
          result={result}
          onSave={offerId ? handleSave : null}
          isSaving={save.isPending}
          showSave={Boolean(offerId)}
        />
      </div>
    </div>
  );
};

export default CommissionCalculatorPage;
