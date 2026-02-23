import { useAuth } from "../../../context/AuthContext";
import { useMyTeam } from "../../../hooks";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useDashboardSummaryQuery } from "./useDashboardSummaryQuery";
import { useDashboardTopAreasQuery } from "./useDashboardTopAreasQuery";
import { useDashboardTopBrokersQuery } from "./useDashboardTopBrokersQuery";
import { useDashboardOffersQuery } from "./useDashboardOffersQuery";
import { useDashboardRequestsQuery } from "./useDashboardRequestsQuery";
import { useDashboardMatchesQuery } from "./useDashboardMatchesQuery";
import { useDashboardUsersQuery } from "./useDashboardUsersQuery";

export const useDashboardData = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const isAdminOrManager = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER]);
  const canSeeSummary = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]);
  const canSeeOffers = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]);
  const canSeeMatches = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]);

  const { data: teamData, isLoading: teamLoading } = useMyTeam();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummaryQuery(canSeeSummary);
  const { data: topBrokers = [], isLoading: brokersLoading } =
    useDashboardTopBrokersQuery(canSeeSummary);
  const { data: topAreas = [], isLoading: areasLoading } =
    useDashboardTopAreasQuery(canSeeSummary);
  const { data: offers = [], isLoading: offersLoading } =
    useDashboardOffersQuery(canSeeOffers);
  const { data: requests = [], isLoading: requestsLoading } =
    useDashboardRequestsQuery(canSeeOffers);
  const { data: matches = [], isLoading: matchesLoading } =
    useDashboardMatchesQuery(canSeeMatches);
  const { data: users = [], isLoading: usersLoading } =
    useDashboardUsersQuery(isAdmin);

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
    offers,
    requests,
    offersLoading,
    requestsLoading,
    matches,
    matchesLoading,
    users,
    usersLoading,
  };
};
