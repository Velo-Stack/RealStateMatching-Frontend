import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChartLineUp, Question } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { UI_LABELS_AR } from "../../../constants/uiLabels.ar";
import { evaluateLandApi } from "../services/landEvaluationApi";
import { buildEvaluatePayloadFromOffer } from "../../feasibility/constants/feasibilityConstants";
import LandEvaluationResultCard from "./LandEvaluationResultCard";

const LandEvaluationPanel = ({ offer, embedded = false }) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("land_evaluation.enabled") && hasPermission(user, "lands.evaluate");
  const [result, setResult] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const evaluate = useMutation({
    mutationFn: evaluateLandApi,
    onSuccess: (data) => setResult(data),
  });

  if (!enabled) {
    return embedded ? null : (
      <div className="p-6 text-center text-slate-400">ميزة تقييم الأراضي غير مفعّلة</div>
    );
  }

  if (offer && offer.type !== "LAND") return null;

  const handleEvaluate = () => {
    const payload = offer ? buildEvaluatePayloadFromOffer(offer) : {};
    evaluate.mutate(payload);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleEvaluate}
          disabled={evaluate.isPending}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50"
        >
          <ChartLineUp size={18} />
          {evaluate.isPending ? "جاري التقدير..." : "تقدير السعر"}
        </button>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="px-3 py-2 rounded-lg text-xs text-slate-400 border border-white/10 hover:bg-white/5 flex items-center gap-1.5"
          title={UI_LABELS_AR.landEvaluationHelpTitle}
        >
          <Question size={16} />
          كيف يعمل؟
        </button>
      </div>

      {showHelp && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-2 text-right">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-cyan-300 m-0">
              {UI_LABELS_AR.landEvaluationHelpTitle}
            </h4>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إغلاق
            </button>
          </div>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside m-0">
            {UI_LABELS_AR.landEvaluationHelpSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {evaluate.isError && (
        <p className="text-sm text-rose-400">{evaluate.error?.response?.data?.message || "فشل التقدير"}</p>
      )}

      <LandEvaluationResultCard evaluation={result} />
    </div>
  );
};

export default LandEvaluationPanel;
