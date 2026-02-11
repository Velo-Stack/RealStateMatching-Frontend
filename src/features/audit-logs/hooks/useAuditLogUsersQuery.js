import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogUsers } from "../services/auditLogsApi";

export const useAuditLogUsersQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: fetchAuditLogUsers,
  });
