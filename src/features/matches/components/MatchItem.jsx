import { Buildings, Target } from "phosphor-react";
import {
  PROPERTY_TYPES,
  USAGE_TYPES,
  getLabelByValue,
} from "../../../constants/enums";

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const resolvePrimaryAmount = (fromValue, toValue) => {
  const from = toNumber(fromValue);
  const to = toNumber(toValue);
  return from ?? to;
};

const formatCurrency = (value) => {
  const parsed = toNumber(value);
  if (parsed === null) return "-";
  return `${parsed.toLocaleString("ar-EG")} ر.س`;
};

const formatType = (type) => getLabelByValue(PROPERTY_TYPES, type) || "غير محدد";
const formatUsage = (usage) => getLabelByValue(USAGE_TYPES, usage) || "غير محدد";

const MatchItem = ({ row, type }) => {
  if (type === "offer") {
    const offerAmount = formatCurrency(
      resolvePrimaryAmount(row.offer?.priceFrom, row.offer?.priceTo),
    );

    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
          <Buildings size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">{formatType(row.offer?.type)}</p>
          <p className="text-xs text-slate-500">
            {formatUsage(row.offer?.usage)} • {row.offer?.city || "-"} • {offerAmount}
          </p>
        </div>
      </div>
    );
  }

  const requestAmount = formatCurrency(
    resolvePrimaryAmount(row.request?.budgetFrom, row.request?.budgetTo),
  );

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
        <Target size={18} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">{formatType(row.request?.type)}</p>
        <p className="text-xs text-slate-500">
          {formatUsage(row.request?.usage)} • {row.request?.city || "-"} • {requestAmount}
        </p>
      </div>
    </div>
  );
};

export default MatchItem;
