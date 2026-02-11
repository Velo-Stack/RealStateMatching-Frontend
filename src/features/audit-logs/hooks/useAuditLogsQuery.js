import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "../services/auditLogsApi";

export const useAuditLogsQuery = (filters) =>
  useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => fetchAuditLogs(filters),
  });
