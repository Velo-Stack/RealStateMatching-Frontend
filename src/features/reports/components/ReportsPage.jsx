import { useState } from "react";
import { useReportsPage } from "../hooks/useReportsPage";
import ReportsCharts from "./ReportsCharts";
import ReportsFieldSelector from "./ReportsFieldSelector";
import ReportsFilters from "./ReportsFilters";
import ReportsHeader from "./ReportsHeader";
import ReportsTable from "./ReportsTable";

const ReportsPage = () => {
  const [isReportSelectorOpen, setIsReportSelectorOpen] = useState(false);
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const {
    type,
    setType,
    downloading,
    handleDownload,
    selectedReport,
    availableFields,
    selectedFields,
    toggleField,
    selectAllFields,
    resetDefaultFields,
  } = useReportsPage();

  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsFilters
        type={type}
        setType={setType}
        selectedReport={selectedReport}
        isOpen={isReportSelectorOpen}
        onToggle={() => setIsReportSelectorOpen((current) => !current)}
      />
      <ReportsFieldSelector
        availableFields={availableFields}
        selectedFields={selectedFields}
        onToggleField={toggleField}
        onSelectAll={selectAllFields}
        onResetDefault={resetDefaultFields}
        isOpen={isFieldSelectorOpen}
        onToggle={() => setIsFieldSelectorOpen((current) => !current)}
      />
      <ReportsCharts
        downloading={downloading}
        handleDownload={handleDownload}
        canDownload={selectedFields.length > 0}
      />
      <ReportsTable
        selectedReport={selectedReport}
        selectedCount={selectedFields.length}
      />
    </div>
  );
};

export default ReportsPage;
