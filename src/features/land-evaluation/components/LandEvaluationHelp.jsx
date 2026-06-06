import { UI_LABELS_AR } from "../../../constants/uiLabels.ar";

const LandEvaluationHelp = () => (
  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-300 space-y-2">
    <p className="font-semibold text-cyan-300">{UI_LABELS_AR.landEvaluationHelpTitle}</p>
    <ol className="list-decimal list-inside space-y-1 text-slate-400">
      {UI_LABELS_AR.landEvaluationHelpSteps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  </div>
);

export default LandEvaluationHelp;
