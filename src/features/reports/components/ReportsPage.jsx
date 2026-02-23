import { useReportsPage } from "../hooks/useReportsPage";
import ReportsCharts from "./ReportsCharts";
import ReportsFilters from "./ReportsFilters";
import ReportsHeader from "./ReportsHeader";
import ReportsTable from "./ReportsTable";

const ReportsPage = () => {
  const { type, setType, downloading, handleDownload, selectedReport } =
    useReportsPage();

  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsFilters type={type} setType={setType} />
      <ReportsCharts downloading={downloading} handleDownload={handleDownload} />
      <ReportsTable selectedReport={selectedReport} />
    </div>
  );
};

export default ReportsPage;
