import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { toTimestamp } from "../../../shared/lib/activityTime";
import { fetchCommissionRules } from "../../commission/services/commissionApi";
import { fetchFeasibilityTemplates } from "../../feasibility/services/feasibilityApi";
import { SOURCE_LABELS } from "../../land-evaluation/constants/landEvaluationConstants";
import { fetchComparables } from "../../land-evaluation/services/landEvaluationApi";

const asList = (value) =>
  Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];

export const useToolsHubData = () => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();

  const commissionFlag = isFeatureEnabled("commission_calculator.enabled");
  const feasibilityFlag = isFeatureEnabled("feasibility.enabled");
  const landsFlag = isFeatureEnabled("land_evaluation.enabled");

  const canCommission =
    commissionFlag &&
    (hasPermission(user, "tools.commission.read") ||
      hasPermission(user, "tools.commission.calculate"));
  const canManageCommissionRules =
    commissionFlag && hasPermission(user, "tools.commission.manageRules");
  const canFeasibility =
    feasibilityFlag && hasPermission(user, "feasibility.run");
  const canComparables =
    landsFlag && hasPermission(user, "lands.comparables.manage");

  const { data: rulesRaw = [], isLoading: rulesLoading } = useQuery({
    queryKey: ["commission-rules"],
    queryFn: fetchCommissionRules,
    enabled: canManageCommissionRules,
  });

  const { data: templatesRaw = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["feasibility-templates"],
    queryFn: fetchFeasibilityTemplates,
    enabled: canFeasibility,
  });

  const { data: comparablesRaw = [], isLoading: comparablesLoading } = useQuery({
    queryKey: ["land-comparables"],
    queryFn: () => fetchComparables(),
    enabled: canComparables,
  });

  const rules = asList(rulesRaw);
  const templates = asList(templatesRaw);
  const comparables = asList(comparablesRaw);

  const cityChartData = useMemo(() => {
    const counts = {};
    comparables.forEach((row) => {
      const name = row.city?.name || "غير محدد";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [comparables]);

  const recentComparables = useMemo(
    () =>
      [...comparables]
        .sort((a, b) => {
          const aTime =
            toTimestamp(a.saleDate) || toTimestamp(a.createdAt) || 0;
          const bTime =
            toTimestamp(b.saleDate) || toTimestamp(b.createdAt) || 0;
          return bTime - aTime;
        })
        .slice(0, 6)
        .map((row) => ({
          id: row.id,
          city: row.city?.name || "—",
          areaM2: row.areaM2,
          pricePerM2: row.pricePerM2,
          source: SOURCE_LABELS[row.source] || row.source || "—",
          saleDate: row.saleDate,
        })),
    [comparables],
  );

  const toolStatuses = [
    {
      key: "commission",
      label: "حاسبة السعي",
      available: canCommission,
      detail: canManageCommissionRules
        ? `${rules.length} قواعد`
        : canCommission
          ? "جاهزة للاستخدام"
          : commissionFlag
            ? "بدون صلاحية"
            : "غير مفعّلة",
    },
    {
      key: "feasibility",
      label: "دراسة الجدوى",
      available: canFeasibility,
      detail: canFeasibility
        ? `${templates.length} قوالب`
        : feasibilityFlag
          ? "بدون صلاحية"
          : "غير مفعّلة",
    },
    {
      key: "comparables",
      label: "صفقات المقارنة",
      available: canComparables,
      detail: canComparables
        ? `${comparables.length} صفقة`
        : landsFlag
          ? "بدون صلاحية"
          : "غير مفعّلة",
    },
  ];

  const enabledToolsCount = toolStatuses.filter((t) => t.available).length;
  const verifiedComparables = comparables.filter((row) => row.isVerified).length;

  const loading =
    (canManageCommissionRules && rulesLoading) ||
    (canFeasibility && templatesLoading) ||
    (canComparables && comparablesLoading);

  return {
    canAccess: canCommission || canFeasibility || canComparables,
    canCommission,
    canFeasibility,
    canComparables,
    loading,
    enabledToolsCount,
    rulesCount: canManageCommissionRules ? rules.length : null,
    templatesCount: canFeasibility ? templates.length : null,
    comparablesCount: canComparables ? comparables.length : null,
    verifiedComparables: canComparables ? verifiedComparables : null,
    cityChartData,
    recentComparables,
    toolStatuses,
    defaultTemplate: templates.find((t) => t.isDefault) || templates[0] || null,
  };
};
