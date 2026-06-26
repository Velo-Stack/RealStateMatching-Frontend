import { useAuth } from "../../../context/AuthContext";
import { useMyTeam } from "../../../hooks";
import { hasPermission, hasRole, ROLES } from "../../../utils/rbac";
import { useDashboardSummaryQuery } from "./useDashboardSummaryQuery";
import { useDashboardTopAreasQuery } from "./useDashboardTopAreasQuery";
import { useDashboardTopBrokersQuery } from "./useDashboardTopBrokersQuery";
import { useDashboardActivityGapsQuery } from "./useDashboardActivityGapsQuery";
import { useDashboardOffersQuery } from "./useDashboardOffersQuery";
import { useDashboardRequestsQuery } from "./useDashboardRequestsQuery";
import { useDashboardMatchesQuery } from "./useDashboardMatchesQuery";
import { useDashboardUsersQuery } from "./useDashboardUsersQuery";

export const useDashboardData = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const canSeeSummary = hasPermission(user, "dashboard.read");
  const canSeeTopLists = hasPermission(user, "dashboard.read") && hasPermission(user, "reports.export");
  const canSeeOffers = hasPermission(user, "offers.read");
  const canSeeRequests = hasPermission(user, "requests.read");
  const canSeeMatches = hasPermission(user, "matches.read");
  const canSeeUsers = hasPermission(user, "users.read");

  const { data: teamData, isLoading: teamLoading } = useMyTeam(hasPermission(user, "teams.read"));
  const { data: summary, isLoading: summaryLoading } = useDashboardSummaryQuery(canSeeSummary);
  const { data: topBrokers = [], isLoading: brokersLoading } =
    useDashboardTopBrokersQuery(canSeeTopLists);
  const { data: topAreas = [], isLoading: areasLoading } =
    useDashboardTopAreasQuery(canSeeTopLists);
  const { data: activityGaps, isLoading: activityGapsLoading } =
    useDashboardActivityGapsQuery(canSeeSummary && isAdmin);
  const { data: offers = [], isLoading: offersLoading } =
    useDashboardOffersQuery(canSeeOffers);
  const { data: requests = [], isLoading: requestsLoading } =
    useDashboardRequestsQuery(canSeeRequests);
  const { data: matches = [], isLoading: matchesLoading } =
    useDashboardMatchesQuery(canSeeMatches);
  const { data: users = [], isLoading: usersLoading } =
    useDashboardUsersQuery(canSeeUsers && isAdmin);

  const loading = summaryLoading || teamLoading;

  return {
    user,
    isAdmin,
    teamData,
    summary,
    topBrokers,
    topAreas,
    activityGaps,
    loading,
    brokersLoading,
    areasLoading,
    activityGapsLoading,
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
