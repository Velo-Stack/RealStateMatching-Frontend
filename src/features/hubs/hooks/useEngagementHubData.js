import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import {
  fetchLeaderboard,
  fetchMyPoints,
  fetchMyTier,
  fetchRewards,
} from "../../gamification/services/gamificationApi";

export const useEngagementHubData = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();

  const pointsEnabled =
    isFeatureEnabled("broker_points.enabled") ||
    isFeatureEnabled("broker_tiers.enabled");
  const canReadPoints = hasPermission(user, "brokers.points.read");
  const enabled = Boolean(pointsEnabled && canReadPoints);

  const pointsQuery = useQuery({
    queryKey: ["my-points", "hub"],
    queryFn: () => fetchMyPoints({ limit: 40 }),
    enabled,
  });

  const tierQuery = useQuery({
    queryKey: ["my-tier", "hub"],
    queryFn: fetchMyTier,
    enabled,
  });

  const rewardsQuery = useQuery({
    queryKey: ["broker-rewards", "hub"],
    queryFn: fetchRewards,
    enabled,
  });

  const leaderboardQuery = useQuery({
    queryKey: ["broker-leaderboard", "hub"],
    queryFn: () => fetchLeaderboard(8),
    enabled,
  });

  const myRank = useMemo(() => {
    const rows = Array.isArray(leaderboardQuery.data)
      ? leaderboardQuery.data
      : [];
    const mine = rows.find((row) => String(row.userId) === String(user?.id));
    return mine?.rank ?? null;
  }, [leaderboardQuery.data, user?.id]);

  return {
    enabled: pointsEnabled,
    canRead: canReadPoints,
    loading:
      enabled &&
      (pointsQuery.isLoading ||
        tierQuery.isLoading ||
        rewardsQuery.isLoading ||
        leaderboardQuery.isLoading),
    balance: pointsQuery.data?.balance,
    entries: Array.isArray(pointsQuery.data?.entries)
      ? pointsQuery.data.entries
      : [],
    tierData: tierQuery.data,
    rewards: Array.isArray(rewardsQuery.data) ? rewardsQuery.data : [],
    leaderboard: Array.isArray(leaderboardQuery.data)
      ? leaderboardQuery.data
      : [],
    myRank,
  };
};
