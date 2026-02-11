import { Funnel } from "phosphor-react";
import { inputClasses } from "../../../constants/styles";
import { STATUS_FILTER_OPTIONS } from "../constants/matchesConstants";

const MatchesFilters = ({ statusFilter, setStatusFilter }) => (
  <div className="flex items-center gap-3">
    <Funnel size={18} className="text-slate-500" />
    <select
      className={inputClasses}
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      {STATUS_FILTER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default MatchesFilters;
