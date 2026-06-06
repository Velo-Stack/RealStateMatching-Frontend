import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChartPieSlice } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import {
  fetchFeasibilityTemplates,
  runFeasibilityQuickApi,
  exportFeasibilityPdfApi,
} from "../services/feasibilityApi";
import { EMPTY_FEASIBILITY_FORM, buildPrefillFromOffer } from "../constants/feasibilityConstants";
import FeasibilityResultCard from "./FeasibilityResultCard";
import FormattedNumberInput from "../../../components/common/FormattedNumberInput";
import { parseFormattedNumber } from "../../../utils/numberFormatting";

const FeasibilityToolPage = ({ initialForm = null, offerId = null, embedded = false }) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("feasibility.enabled") && hasPermission(user, "feasibility.run");

  const [form, setForm] = useState(initialForm || EMPTY_FEASIBILITY_FORM);
  const [result, setResult] = useState(null);
  const [studyId, setStudyId] = useState(null);

  useEffect(() => {
    if (initialForm) setForm(initialForm);
  }, [initialForm]);

  const { data: templates = [] } = useQuery({
    queryKey: ["feasibility-templates"],
    queryFn: fetchFeasibilityTemplates,
    enabled,
  });

  const runStudy = useMutation({
    mutationFn: runFeasibilityQuickApi,
    onSuccess: (data) => {
      setResult(data.outputs);
      setStudyId(data.study?.id);
    },
  });

  const exportPdf = useMutation({
    mutationFn: exportFeasibilityPdfApi,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `feasibility-${studyId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });

  if (!enabled) {
    return embedded ? null : (
      <div className="p-6 text-center text-slate-400">ميزة دراسة الجدوى غير مفعّلة</div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    runStudy.mutate({
      templateId: templates.find((t) => t.isDefault)?.id || templates[0]?.id,
      offerId,
      inputs: {
        landArea: parseFormattedNumber(form.landArea),
        landPrice: parseFormattedNumber(form.landPrice),
        investorCount: parseFormattedNumber(form.investorCount),
        investmentPerInvestor: form.investmentPerInvestor
          ? parseFormattedNumber(form.investmentPerInvestor)
          : undefined,
        expectedSalePrice: parseFormattedNumber(form.expectedSalePrice),
        holdingMonths: parseFormattedNumber(form.holdingMonths),
        developmentCost: form.developmentCost ? parseFormattedNumber(form.developmentCost) : 0,
      },
    });
  };

  const numericFields = [
    ["landArea", "مساحة الأرض (م²)"],
    ["landPrice", "سعر الشراء (ر.س)"],
    ["investorCount", "عدد المستثمرين"],
    ["expectedSalePrice", "سعر البيع المتوقع (ر.س)"],
    ["holdingMonths", "مدة الاحتفاظ (شهر)"],
    ["developmentCost", "تكلفة التطوير (ر.س) — اختياري"],
  ];

  return (
    <div className={embedded ? "space-y-4" : "p-4 md:p-6 space-y-6"}>
      {!embedded && (
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ChartPieSlice size={24} className="text-violet-400" />
            دراسة جدوى سريعة — أرض
          </h1>
          <p className="text-sm text-slate-400 mt-1">احسب العائد والمخاطر قبل الشراء</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {numericFields.map(([key, label]) => (
          <div key={key}>
            <FormattedNumberInput
              label={label}
              name={key}
              dir="ltr"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key !== "developmentCost"}
            />
          </div>
        ))}

        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={runStudy.isPending}
            className="theme-button-primary px-6 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {runStudy.isPending ? "جاري الحساب..." : "احسب الجدوى"}
          </button>
        </div>
      </form>

      {runStudy.isError && (
        <p className="text-sm text-rose-400">{runStudy.error?.response?.data?.message || "فشل الحساب"}</p>
      )}

      <FeasibilityResultCard
        outputs={result}
        studyId={studyId}
        onExport={(id) => exportPdf.mutate(id)}
        exporting={exportPdf.isPending}
      />
    </div>
  );
};

export default FeasibilityToolPage;
