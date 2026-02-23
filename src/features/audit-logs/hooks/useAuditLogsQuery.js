import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "../services/auditLogsApi";
import { AUDIT_LOGS_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useAuditLogsQuery = (filters) =>
  useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.list(filters),
    queryFn: () => fetchAuditLogs(filters),
  });
