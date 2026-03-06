import { Flag } from "phosphor-react";
import { priorityConfig } from "../constants/requestsConstants";

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const getPrimaryValue = (firstValue, secondValue) => {
  const first = toNumber(firstValue);
  const second = toNumber(secondValue);
  return first ?? second;
};

const formatPrimaryValue = (firstValue, secondValue) => {
  const resolved = getPrimaryValue(firstValue, secondValue);
  if (resolved === null) return "-";
  return resolved.toLocaleString("ar-EG");
};

const RequestDetailsPanel = ({ request, type }) => {
  if (type === "area") {
    return (
      <span className="text-emerald-400 font-medium">
        {formatPrimaryValue(request.areaFrom, request.areaTo)}
      </span>
    );
  }

  if (type === "budget") {
    return (
      <span className="text-emerald-400 font-medium">
        {formatPrimaryValue(request.budgetFrom, request.budgetTo)}
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

