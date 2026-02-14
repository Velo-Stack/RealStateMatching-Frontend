import { useState } from "react";
import { useAuditLogsFilters } from "../hooks/useAuditLogsFilters";
import { useAuditLogsQuery } from "../hooks/useAuditLogsQuery";
import { useAuditLogUsersQuery } from "../hooks/useAuditLogUsersQuery";
import { getAuditLogsStats, groupLogsByDate } from "../utils/auditLogsUtils";
import AuditLogsHeader from "./AuditLogsHeader";
import AuditLogsStats from "./AuditLogsStats";
import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsList from "./AuditLogsList";
import AuditLogDetailsDrawer from "./AuditLogDetailsDrawer";

const AuditLogsPage = () => {
  const [expandedLog, setExpandedLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { filters, handleChange, clearFilters, hasActiveFilters } =
    useAuditLogsFilters();
  const { data: logs = [], isLoading } = useAuditLogsQuery(filters);
  const { data: users = [] } = useAuditLogUsersQuery();

  const groupedLogs = groupLogsByDate(logs);
  const stats = getAuditLogsStats(logs);

  const handleShowDetails = (log) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div className="space-y-6">
      <AuditLogsHeader />
      <AuditLogsStats stats={stats} />
      <AuditLogsFilters
        filters={filters}
        users={users}
        hasActiveFilters={hasActiveFilters}
        handleChange={handleChange}
        clearFilters={clearFilters}
      />
      <AuditLogsList
        isLoading={isLoading}
        logs={logs}
        groupedLogs={groupedLogs}
        expandedLog={expandedLog}
        setExpandedLog={setExpandedLog}
        onShowDetails={handleShowDetails}
      />

      <AuditLogDetailsDrawer
        log={selectedLog}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default AuditLogsPage;
