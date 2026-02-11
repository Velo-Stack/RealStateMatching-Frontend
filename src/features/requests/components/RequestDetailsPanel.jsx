import { Flag } from "phosphor-react";
import { priorityConfig } from "../constants/requestsConstants";

const RequestDetailsPanel = ({ request, type }) => {
  if (type === "area") {
    return (
      <span className="text-emerald-400 font-medium">
        {request.areaFrom ?? "-"} - {request.areaTo ?? "-"}
      </span>
    );
  }

  if (type === "budget") {
    return (
      <span className="text-cyan-400 font-medium">
        {request.budgetFrom ? Number(request.budgetFrom).toLocaleString() : "-"} -{" "}
        {request.budgetTo ? Number(request.budgetTo).toLocaleString() : "-"}
      </span>
    );
  }

  const cfg = priorityConfig[request.priority] || priorityConfig.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}
    >
      <Flag size={12} weight="fill" />
      {cfg.label}
    </span>
  );
};

export default RequestDetailsPanel;
