import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission, hasRole, ROLES } from "../../../utils/rbac";
import { useDashboardActivityGapsQuery } from "../../dashboard/hooks/useDashboardActivityGapsQuery";
import { useDashboardOffersQuery } from "../../dashboard/hooks/useDashboardOffersQuery";
import { useDashboardRequestsQuery } from "../../dashboard/hooks/useDashboardRequestsQuery";
import { useDashboardSummaryQuery } from "../../dashboard/hooks/useDashboardSummaryQuery";
import { useDashboardTopAreasQuery } from "../../dashboard/hooks/useDashboardTopAreasQuery";
import { toTimestamp } from "../../../shared/lib/activityTime";

const asList = (value) =>
  Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];

export const useOperationsHubData = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);
  const canSeeSummary = hasPermission(user, "dashboard.read");
  const canSeeTopLists =
    hasPermission(user, "dashboard.read") &&
    hasPermission(user, "reports.export");
  const canSeeOffers = hasPermission(user, "offers.read");
  const canSeeRequests = hasPermission(user, "requests.read");
  const canSeeMatches = hasPermission(user, "matches.read");

  const { data: summary, isLoading: summaryLoading } =
    useDashboardSummaryQuery(canSeeSummary);
  const { data: topAreas = [], isLoading: areasLoading } =
    useDashboardTopAreasQuery(canSeeTopLists);
  const { data: activityGaps, isLoading: activityGapsLoading } =
    useDashboardActivityGapsQuery(canSeeSummary && isAdmin);
  const { data: offersRaw = [], isLoading: offersLoading } =
    useDashboardOffersQuery(canSeeOffers);
  const { data: requestsRaw = [], isLoading: requestsLoading } =
    useDashboardRequestsQuery(canSeeRequests);

  const offers = asList(offersRaw);
  const requests = asList(requestsRaw);

  const recentActivity = useMemo(() => {
    const rows = [
      ...offers.map((item) => ({
        id: `offer-${item.id}`,
        type: "offer",
        label: item.title || item.propertyType || "عرض عقاري",
        createdAt: item.createdAt,
      })),
      ...requests.map((item) => ({
        id: `request-${item.id}`,
        type: "request",
        label: item.title || item.propertyType || "طلب عميل",
        createdAt: item.createdAt,
      })),
    ];

    return rows
      .filter((row) => toTimestamp(row.createdAt) !== null)
      .sort(
        (a, b) =>
          (toTimestamp(b.createdAt) || 0) - (toTimestamp(a.createdAt) || 0),
      )
      .slice(0, 6);
  }, [offers, requests]);

  const offersCount =
    summary?.offers ?? (canSeeOffers ? offers.length : null);
  const requestsCount =
    summary?.requests ?? (canSeeRequests ? requests.length : null);
  const matchesCount = canSeeSummary ? summary?.matches ?? null : null;

  const loading =
    (canSeeSummary && summaryLoading) ||
    (canSeeOffers && offersLoading) ||
    (canSeeRequests && requestsLoading);

  return {
    canSeeSummary,
    canSeeOffers,
    canSeeRequests,
    canSeeMatches,
    canSeeTopLists,
    isAdmin,
    loading,
    offersCount,
    requestsCount,
    matchesCount,
    offers,
    requests,
    offersLoading,
    requestsLoading,
    topAreas: Array.isArray(topAreas) ? topAreas : [],
    areasLoading,
    activityGaps,
    activityGapsLoading,
    recentActivity,
  };
};
