import { REPORT_TYPES } from "../constants/reportsConstants";
import ReportItem from "./ReportItem";

const ReportsFilters = ({ type, setType }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {REPORT_TYPES.map((report) => (
      <ReportItem
        key={report.value}
        report={report}
        isSelected={type === report.value}
        onSelect={() => setType(report.value)}
      />
    ))}
  </div>
);

export default ReportsFilters;
