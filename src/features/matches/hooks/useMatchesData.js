import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/rbac";
import { MATCHES_PAGE_SIZE } from "../constants/matchesConstants";
import { useMatchesQuery } from "./useMatchesQuery";
import { useUpdateMatchStatusMutation } from "./useUpdateMatchStatusMutation";
import { getMatchesStats } from "../utils/matchesUtils";

export const useMatchesData = ({ statusFilter, currentPage }) => {
  const { user } = useAuth();
  const { data, isLoading } = useMatchesQuery({
    status: statusFilter,
    page: currentPage,
    limit: MATCHES_PAGE_SIZE,
  });
  const updateStatus = useUpdateMatchStatusMutation();
  const canUpdateStatus = hasPermission(user, "matches.update");

  const matches = data?.items ?? [];
  const pagination = data?.pagination ?? {
    page: currentPage,
    limit: MATCHES_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };
  const stats = data?.stats ?? getMatchesStats(matches);

  return {
    matches,
    pagination,
    isLoading,
    updateStatus,
    stats,
    canUpdateStatus,
  };
};
