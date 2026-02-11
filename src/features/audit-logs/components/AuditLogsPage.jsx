import { useState } from "react";
import { useAuditLogsFilters } from "../hooks/useAuditLogsFilters";
import { useAuditLogsQuery } from "../hooks/useAuditLogsQuery";
import { useAuditLogUsersQuery } from "../hooks/useAuditLogUsersQuery";
import { getAuditLogsStats, groupLogsByDate } from "../utils/auditLogsUtils";
import AuditLogsHeader from "./AuditLogsHeader";
import AuditLogsStats from "./AuditLogsStats";
import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsList from "./AuditLogsList";

const AuditLogsPage = () => {
  const [expandedLog, setExpandedLog] = useState(null);
  const { filters, handleChange, clearFilters, hasActiveFilters } =
    useAuditLogsFilters();
  const { data: logs = [], isLoading } = useAuditLogsQuery(filters);
  const { data: users = [] } = useAuditLogUsersQuery();

  const groupedLogs = groupLogsByDate(logs);
  const stats = getAuditLogsStats(logs);

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
      />
    </div>
  );
};

export default AuditLogsPage;
