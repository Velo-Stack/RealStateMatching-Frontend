import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogUsers } from "../services/auditLogsApi";
import { AUDIT_LOGS_QUERY_KEYS } from "../../../shared/query/queryKeys";

export const useAuditLogUsersQuery = () =>
  useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.users,
    queryFn: fetchAuditLogUsers,
  });
