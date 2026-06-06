import { UI_LABELS_AR } from "../../../constants/uiLabels.ar";

const FeatureFlagsLiveSection = () => (
  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3 text-sm text-slate-300">
    <h2 className="text-base font-semibold text-emerald-300">
      {UI_LABELS_AR.flagsLiveVsExperimentalTitle}
    </h2>
    <p>{UI_LABELS_AR.flagsLiveCore}</p>
    <p>{UI_LABELS_AR.flagsExperimental}</p>
    <p className="text-xs text-slate-500">
      مفاتيح الـ flags تظهر بصيغة تقنية (monospace) للمطورين — التسمية العربية في عمود «الميزة».
    </p>
  </div>
);

export default FeatureFlagsLiveSection;
