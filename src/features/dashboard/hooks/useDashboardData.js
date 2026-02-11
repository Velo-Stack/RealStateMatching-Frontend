import { useAuth } from "../../../context/AuthContext";
import { useMyTeam } from "../../../hooks";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useDashboardSummaryQuery } from "./useDashboardSummaryQuery";
import { useDashboardTopAreasQuery } from "./useDashboardTopAreasQuery";
import { useDashboardTopBrokersQuery } from "./useDashboardTopBrokersQuery";

export const useDashboardData = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  const { data: teamData, isLoading: teamLoading } = useMyTeam();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummaryQuery();
  const { data: topBrokers = [], isLoading: brokersLoading } =
    useDashboardTopBrokersQuery(isAdmin);
  const { data: topAreas = [], isLoading: areasLoading } =
    useDashboardTopAreasQuery(isAdmin);

  const loading = summaryLoading || teamLoading;

  return {
    user,
    isAdmin,
    teamData,
    summary,
    topBrokers,
    topAreas,
    loading,
    brokersLoading,
    areasLoading,
  };
};
