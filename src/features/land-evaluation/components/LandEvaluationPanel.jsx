import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChartLineUp } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { evaluateLandApi } from "../services/landEvaluationApi";
import { buildEvaluatePayloadFromOffer } from "../../feasibility/constants/feasibilityConstants";
import LandEvaluationResultCard from "./LandEvaluationResultCard";

const LandEvaluationPanel = ({ offer, embedded = false }) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("land_evaluation.enabled") && hasPermission(user, "lands.evaluate");
  const [result, setResult] = useState(null);

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
      <button
        type="button"
        onClick={handleEvaluate}
        disabled={evaluate.isPending}
        className="px-5 py-2 rounded-lg text-sm font-medium bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50"
      >
        <ChartLineUp size={18} />
        {evaluate.isPending ? "جاري التقدير..." : "تقدير السعر"}
      </button>

      {evaluate.isError && (
        <p className="text-sm text-rose-400">{evaluate.error?.response?.data?.message || "فشل التقدير"}</p>
      )}

      <LandEvaluationResultCard evaluation={result} />
    </div>
  );
};

export default LandEvaluationPanel;
