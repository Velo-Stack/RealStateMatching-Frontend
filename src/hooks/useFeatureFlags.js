import { useQuery } from "@tanstack/react-query";
import { fetchPublicFeatureFlags } from "../features/settings/services/featureFlagsApi";

const FEATURE_FLAGS_QUERY_KEY = ["public-feature-flags"];

export const useFeatureFlags = () => {
  const query = useQuery({
    queryKey: FEATURE_FLAGS_QUERY_KEY,
    queryFn: fetchPublicFeatureFlags,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const enabledSet = new Set(query.data?.enabled || []);

  return {
    ...query,
    enabledFlags: query.data?.enabled || [],
    isFeatureEnabled: (key) => enabledSet.has(key),
  };
};

export { FEATURE_FLAGS_QUERY_KEY };
