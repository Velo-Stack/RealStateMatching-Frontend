import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useMatchesQuery } from "./useMatchesQuery";
import { useMatchesFilters } from "./useMatchesFilters";
import { useUpdateMatchStatusMutation } from "./useUpdateMatchStatusMutation";
import { getMatchesStats } from "../utils/matchesUtils";

export const useMatchesData = () => {
  const { user } = useAuth();
  const { data: matches = [], isLoading } = useMatchesQuery();
  const updateStatus = useUpdateMatchStatusMutation();
  const { statusFilter, setStatusFilter, filteredMatches } = useMatchesFilters(
    matches,
  );
  const stats = getMatchesStats(matches);
  const canUpdateStatus = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]);

  return {
    matches,
    filteredMatches,
    isLoading,
    statusFilter,
    setStatusFilter,
    updateStatus,
    stats,
    canUpdateStatus,
  };
};
