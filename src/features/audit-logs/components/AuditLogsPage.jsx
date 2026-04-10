import { useMemo, useState } from "react";
import { useAuditLogsFilters } from "../hooks/useAuditLogsFilters";
import { useAuditLogsQuery } from "../hooks/useAuditLogsQuery";
import { useAuditLogUsersQuery } from "../hooks/useAuditLogUsersQuery";
import { getAuditLogsStats, groupLogsByDate } from "../utils/auditLogsUtils";
import { AUDIT_LOGS_PAGE_SIZE } from "../constants/auditLogsDefaults";
import AuditLogsHeader from "./AuditLogsHeader";
import AuditLogsStats from "./AuditLogsStats";
import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsList from "./AuditLogsList";
import AuditLogDetailsDrawer from "./AuditLogDetailsDrawer";

const AuditLogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLog, setExpandedLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { filters, handleChange: baseHandleChange, clearFilters: baseClearFilters, hasActiveFilters } =
    useAuditLogsFilters();
  const { data: logs = [], isLoading, isFetching } = useAuditLogsQuery(filters);
  const { data: users = [] } = useAuditLogUsersQuery();

  const handleChange = (e) => {
    setCurrentPage(1);
    setExpandedLog(null);
    baseHandleChange(e);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setExpandedLog(null);
    baseClearFilters();
  };

  const totalLogs = logs.length;
  const totalPages = Math.max(1, Math.ceil(totalLogs / AUDIT_LOGS_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * AUDIT_LOGS_PAGE_SIZE;
    const endIndex = startIndex + AUDIT_LOGS_PAGE_SIZE;
    return logs.slice(startIndex, endIndex);
  }, [logs, safeCurrentPage]);

  const groupedLogs = groupLogsByDate(paginatedLogs);
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
        isFetching={isFetching}
        logs={paginatedLogs}
        groupedLogs={groupedLogs}
        expandedLog={expandedLog}
        setExpandedLog={setExpandedLog}
        onShowDetails={handleShowDetails}
        currentPage={safeCurrentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        totalCount={totalLogs}
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
