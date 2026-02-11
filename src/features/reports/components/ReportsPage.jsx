import { useReportsPage } from "../hooks/useReportsPage";
import EmptyState from "./EmptyState";
import ReportsCharts from "./ReportsCharts";
import ReportsFilters from "./ReportsFilters";
import ReportsHeader from "./ReportsHeader";
import ReportsStats from "./ReportsStats";
import ReportsTable from "./ReportsTable";

const ReportsPage = () => {
  const { type, setType, downloading, handleDownload, selectedReport } =
    useReportsPage();

  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsStats />
      <ReportsFilters type={type} setType={setType} />
      <ReportsCharts downloading={downloading} handleDownload={handleDownload} />
      <ReportsTable selectedReport={selectedReport} />
      <EmptyState />
    </div>
  );
};

export default ReportsPage;
