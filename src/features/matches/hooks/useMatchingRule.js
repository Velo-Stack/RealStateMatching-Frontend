import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MATCHING_RULE_QUERY_KEY,
  MATCHING_CATALOG_QUERY_KEY,
  MATCHING_SNAPSHOTS_QUERY_KEY,
  fetchActiveMatchingRule,
  fetchMatchingCatalog,
  fetchMatchingSnapshots,
  updateMatchingRule,
  previewMatchingRule,
  rerunMatches,
  restoreSnapshot,
} from "../services/matchingRuleApi";
import { MATCHES_QUERY_KEY } from "../constants/matchesConstants";

// ─── Active Rule ─────────────────────────────────────────────────────────────

export const useActiveMatchingRule = (enabled = true) =>
  useQuery({
    queryKey: MATCHING_RULE_QUERY_KEY,
    queryFn: fetchActiveMatchingRule,
    enabled,
    staleTime: 30_000,
  });

// ─── Catalog ─────────────────────────────────────────────────────────────────

export const useMatchingCatalog = (enabled = true) =>
  useQuery({
    queryKey: MATCHING_CATALOG_QUERY_KEY,
    queryFn: fetchMatchingCatalog,
    enabled,
    staleTime: Infinity, // ثابت — لا يتغير إلا بتحديث الكود
  });

// ─── Update Rule ─────────────────────────────────────────────────────────────

export const useUpdateMatchingRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMatchingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHING_RULE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MATCHING_SNAPSHOTS_QUERY_KEY });
      // التطابقات ستتغير في الخلفية — refresh بعد 3 ثواني
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
      }, 3000);
      toast.success("تم تحديث قاعدة التطابق — جاري إعادة الحساب في الخلفية");
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || "تعذر تحديث القاعدة";
      toast.error(msg);
    },
  });
};

// ─── Preview ─────────────────────────────────────────────────────────────────

export const usePreviewMatchingRule = () =>
  useMutation({
    mutationFn: previewMatchingRule,
    onError: (err) => {
      const msg = err?.response?.data?.error || "تعذر المعاينة";
      toast.error(msg);
    },
  });

// ─── Re-run ──────────────────────────────────────────────────────────────────

export const useRerunMatches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rerunMatches,
    onSuccess: () => {
      toast.success("بدأت إعادة حساب التطابقات في الخلفية");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
      }, 5000);
    },
    onError: () => toast.error("تعذر بدء إعادة الحساب"),
  });
};

// ─── Snapshots ───────────────────────────────────────────────────────────────

export const useMatchingSnapshots = ({ page = 1, limit = 10, enabled = true } = {}) =>
  useQuery({
    queryKey: [...MATCHING_SNAPSHOTS_QUERY_KEY, { page, limit }],
    queryFn: () => fetchMatchingSnapshots({ page, limit }),
    enabled,
    keepPreviousData: true,
  });

export const useRestoreSnapshot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreSnapshot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHING_RULE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MATCHING_SNAPSHOTS_QUERY_KEY });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
      }, 3000);
      toast.success("تم استعادة القاعدة — جاري إعادة الحساب في الخلفية");
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || "تعذر استعادة القاعدة";
      toast.error(msg);
    },
  });
};
