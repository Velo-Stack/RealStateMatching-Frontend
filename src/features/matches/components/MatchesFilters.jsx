import { Funnel, Percent } from "phosphor-react";
import { inputClasses } from "../../../constants/styles";
import {
  STATUS_FILTER_OPTIONS,
  SCORE_FILTER_OPTIONS,
} from "../constants/matchesConstants";

const MatchesFilters = ({
  statusFilter,
  setStatusFilter,
  minScoreFilter = "ALL",
  setMinScoreFilter,
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    {/* فلتر نسبة التطابق */}
    <div className="flex items-center gap-1.5">
      <Percent size={16} className="text-emerald-400 shrink-0" />
      <select
        className={inputClasses}
        value={minScoreFilter}
        onChange={(e) => setMinScoreFilter(e.target.value)}
        title="تصفية حسب نسبة التطابق"
      >
        {SCORE_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {/* فلتر الحالة / الإجراء */}
    <div className="flex items-center gap-1.5">
      <Funnel size={16} className="text-slate-400 shrink-0" />
      <select
        className={inputClasses}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        title="تصفية حسب الحالة"
      >
        {STATUS_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default MatchesFilters;
