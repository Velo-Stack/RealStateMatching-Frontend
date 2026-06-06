import { useAuth } from "../context/AuthContext";
import { useFeatureFlags } from "./useFeatureFlags";

const UNRESTRICTED = {
  planCode: "UNRESTRICTED",
  maxOffers: null,
  maps: true,
  calculator: true,
  landEval: true,
  feasibility: true,
  advancedSearch: true,
  savedSearches: true,
  geoSearch: true,
  reports: true,
};

export const useEntitlements = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const subscriptionsEnabled = isFeatureEnabled("subscriptions.enabled");

  const entitlements = user?.entitlements || UNRESTRICTED;
  const planCode = user?.planCode || entitlements.planCode || "UNRESTRICTED";
  const isPro = ["PRO", "OFFICE", "ENTERPRISE", "UNRESTRICTED"].includes(planCode);
  const isFree = subscriptionsEnabled && planCode === "FREE";

  const hasFeature = (feature) => {
    if (!subscriptionsEnabled) return true;
    if (user?.role === "ADMIN") return true;
    return Boolean(entitlements[feature]);
  };

  return {
    entitlements,
    planCode,
    isPro,
    isFree,
    subscriptionsEnabled,
    hasFeature,
  };
};

export default useEntitlements;
