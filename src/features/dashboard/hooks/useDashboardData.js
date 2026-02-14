import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useMyTeam } from "../../../hooks";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useDashboardSummaryQuery } from "./useDashboardSummaryQuery";
import { useDashboardTopAreasQuery } from "./useDashboardTopAreasQuery";
import { useDashboardTopBrokersQuery } from "./useDashboardTopBrokersQuery";
import { OFFERS_QUERY_KEY } from "../../offers/constants/offersConstants";
import { REQUESTS_QUERY_KEY } from "../../requests/constants/requestsConstants";
import { fetchOffers } from "../../offers/services/offersApi";
import { fetchRequests } from "../../requests/services/requestsApi";
import { MATCHES_QUERY_KEY } from "../../matches/constants/matchesConstants";
import { fetchMatches } from "../../matches/services/matchesApi";
import { USERS_QUERY_KEY } from "../../users/constants/usersConstants";
import { fetchUsers } from "../../users/services/usersApi";

export const useDashboardData = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  const { data: teamData, isLoading: teamLoading } = useMyTeam();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummaryQuery();
  const { data: topBrokers = [], isLoading: brokersLoading } =
    useDashboardTopBrokersQuery(isAdmin);
  const { data: topAreas = [], isLoading: areasLoading } =
    useDashboardTopAreasQuery(isAdmin);
  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: OFFERS_QUERY_KEY,
    queryFn: fetchOffers,
    staleTime: 60_000,
  });
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: REQUESTS_QUERY_KEY,
    queryFn: fetchRequests,
    staleTime: 60_000,
  });
  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: fetchMatches,
    staleTime: 60_000,
    enabled: isAdmin,
  });
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: 60_000,
    enabled: isAdmin,
  });

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
