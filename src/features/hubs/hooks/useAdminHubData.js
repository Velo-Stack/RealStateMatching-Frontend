import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { toTimestamp } from "../../../shared/lib/activityTime";
import { TEAMS_QUERY_KEY } from "../../teams/constants/teamsConstants";
import { fetchTeams } from "../../teams/services/teamsApi";
import { USERS_QUERY_KEY, roleConfig } from "../../users/constants/usersConstants";
import { fetchUsers } from "../../users/services/usersApi";
import {
  getActiveUsers,
  getUsersByRole,
} from "../../users/utils/usersUtils";
import { fetchOffices } from "../../offices/services/officesApi";
import { fetchRegistrations } from "../../registrations/services/registrationsApi";
import {
  fetchJoinApplicationStats,
  fetchJoinApplications,
} from "../../join-us/services/joinUsApi";

const asList = (value) => (Array.isArray(value) ? value : []);

export const useAdminHubData = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();

  const canReadUsers = hasPermission(user, "users.read");
  const canReadTeams = hasPermission(user, "teams.read");
  const canReadOffices =
    hasPermission(user, "offices.read") &&
    isFeatureEnabled("offices.enabled");
  const canReadRegistrations =
    hasPermission(user, "registrations.read") &&
    isFeatureEnabled("self_registration.enabled");
  const canReadJoinApps =
    hasPermission(user, "joinApplications.read") &&
    isFeatureEnabled("join_us.enabled");

  const includeInactiveOffices = user?.role === "ADMIN";

  const { data: usersRaw = [], isLoading: usersLoading } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    enabled: canReadUsers,
  });

  const { data: teamsRaw = [], isLoading: teamsLoading } = useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: fetchTeams,
    enabled: canReadTeams,
  });

  const { data: officesRaw = [], isLoading: officesLoading } = useQuery({
    queryKey: ["offices", includeInactiveOffices],
    queryFn: () => fetchOffices({ includeInactive: includeInactiveOffices }),
    enabled: canReadOffices,
  });

  const { data: pendingRegistrationsRaw = [], isLoading: registrationsLoading } =
    useQuery({
      queryKey: ["registrations", "PENDING"],
      queryFn: () => fetchRegistrations("PENDING"),
      enabled: canReadRegistrations,
    });

  const { data: joinStats, isLoading: joinStatsLoading } = useQuery({
    queryKey: ["join-applications", "stats"],
    queryFn: fetchJoinApplicationStats,
    enabled: canReadJoinApps,
  });

  const { data: pendingJoinRaw = [], isLoading: joinPendingLoading } = useQuery({
    queryKey: ["join-applications", "PENDING"],
    queryFn: () => fetchJoinApplications("PENDING"),
    enabled: canReadJoinApps,
  });

  const users = getActiveUsers(asList(usersRaw));
  const teams = asList(teamsRaw);
  const offices = asList(officesRaw);
  const pendingRegistrations = asList(pendingRegistrationsRaw);
  const pendingJoinApps = asList(pendingJoinRaw);

  const usersByRole = useMemo(() => getUsersByRole(users), [users]);

  const roleChartData = useMemo(
    () =>
      Object.entries(roleConfig).map(([role, config]) => ({
        name: config.label,
        count: usersByRole[role]?.length || 0,
        role,
      })),
    [usersByRole],
  );

  const recentPending = useMemo(() => {
    const rows = [
      ...pendingRegistrations.map((item) => ({
        id: `reg-${item.id}`,
        kind: "تسجيل",
        title: item.name || item.email || "طلب تسجيل",
        createdAt: item.createdAt,
      })),
      ...pendingJoinApps.map((item) => ({
        id: `join-${item.id}`,
        kind: "انضمام",
        title:
          item.fullName ||
          item.name ||
          [item.firstName, item.lastName].filter(Boolean).join(" ") ||
          item.email ||
          "طلب انضمام",
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
  }, [pendingRegistrations, pendingJoinApps]);

  const loading =
    (canReadUsers && usersLoading) ||
    (canReadTeams && teamsLoading) ||
    (canReadOffices && officesLoading) ||
    (canReadRegistrations && registrationsLoading) ||
    (canReadJoinApps && (joinStatsLoading || joinPendingLoading));

  return {
    canReadUsers,
    canReadTeams,
    canReadOffices,
    canReadRegistrations,
    canReadJoinApps,
    canAccess:
      canReadUsers ||
      canReadTeams ||
      canReadOffices ||
      canReadRegistrations ||
      canReadJoinApps,
    loading,
    usersCount: canReadUsers ? users.length : null,
    teamsCount: canReadTeams ? teams.length : null,
    officesCount: canReadOffices ? offices.length : null,
    pendingRegistrationsCount: canReadRegistrations
      ? pendingRegistrations.length
      : null,
    pendingJoinCount: canReadJoinApps
      ? (joinStats?.pending ?? pendingJoinApps.length)
      : null,
    joinStats,
    roleChartData,
    recentPending,
  };
};
