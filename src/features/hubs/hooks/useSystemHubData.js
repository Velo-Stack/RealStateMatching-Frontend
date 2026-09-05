import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { useEntitlements } from "../../../hooks/useEntitlements";
import { hasPermission } from "../../../utils/rbac";
import { toTimestamp } from "../../../shared/lib/activityTime";
import { FEATURE_FLAG_CATALOG } from "../../../config/featureFlagCatalog";
import { AUDIT_LOGS_QUERY_KEYS } from "../../../shared/query/queryKeys";
import { fetchAuditLogs } from "../../audit-logs/services/auditLogsApi";
import { actionConfig } from "../../audit-logs/constants/auditLogsConfig";
import {
  getActionDescription,
  getAuditLogsStats,
} from "../../audit-logs/utils/auditLogsUtils";
import { initialFilters } from "../../audit-logs/constants/auditLogsDefaults";
import { REPORT_TYPES } from "../../reports/constants/reportsConstants";
import { fetchFeatureFlags } from "../../settings/services/featureFlagsApi";
import {
  fetchMySubscription,
  fetchPlans,
} from "../../subscriptions/services/subscriptionsApi";

const asList = (value) => (Array.isArray(value) ? value : []);

export const useSystemHubData = () => {
  const { user } = useAuth();
  const { enabledFlags, isFeatureEnabled } = useFeatureFlags();
  const { planCode, subscriptionsEnabled } = useEntitlements();

  const canAudit = hasPermission(user, "auditLogs.read");
  const canReports = hasPermission(user, "reports.export");
  const canFlags =
    hasPermission(user, "featureFlags.read") ||
    hasPermission(user, "featureFlags.manage");
  const canSubscriptions =
    subscriptionsEnabled && hasPermission(user, "subscriptions.read");

  const { data: auditRaw = [], isLoading: auditLoading } = useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.list(initialFilters),
    queryFn: () => fetchAuditLogs(initialFilters),
    enabled: canAudit,
  });

  const { data: adminFlags = [], isLoading: flagsLoading } = useQuery({
    queryKey: ["admin-feature-flags"],
    queryFn: fetchFeatureFlags,
    enabled: canFlags,
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchPlans,
    enabled: canSubscriptions,
  });

  const { data: subscriptionMe, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["subscription-me"],
    queryFn: fetchMySubscription,
    enabled: canSubscriptions,
  });

  const auditLogs = asList(auditRaw);
  const auditStats = useMemo(() => getAuditLogsStats(auditLogs), [auditLogs]);

  const actionChartData = useMemo(() => {
    const counts = {};
    auditLogs.forEach((log) => {
      const key = log.action || "OTHER";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([action, count]) => ({
        name: actionConfig[action]?.label || action,
        count,
        action,
      }))
      .sort((a, b) => b.count - a.count);
  }, [auditLogs]);

  const recentAudit = useMemo(
    () =>
      [...auditLogs]
        .sort(
          (a, b) =>
            (toTimestamp(b.createdAt) || 0) - (toTimestamp(a.createdAt) || 0),
        )
        .slice(0, 6)
        .map((log) => ({
          id: log.id,
          title: getActionDescription(log),
          userName: log.user?.name || log.userName || "—",
          createdAt: log.createdAt,
          action: log.action,
        })),
    [auditLogs],
  );

  const flagsList = canFlags ? asList(adminFlags) : [];
  const enabledFlagsCount = canFlags
    ? flagsList.filter((flag) => flag.enabled).length
    : asList(enabledFlags).length;
  const totalFlagsCount = canFlags
    ? flagsList.length || FEATURE_FLAG_CATALOG.length
    : FEATURE_FLAG_CATALOG.length;

  const moduleStatuses = [
    {
      key: "reports",
      label: "التقارير",
      available: canReports,
      detail: canReports
        ? `${REPORT_TYPES.length} أنواع تصدير`
        : "بدون صلاحية",
    },
    {
      key: "audit",
      label: "سجلات التدقيق",
      available: canAudit,
      detail: canAudit
        ? `${auditStats.total} عملية محمّلة`
        : "بدون صلاحية",
    },
    {
      key: "flags",
      label: "إعدادات النظام",
      available: canFlags,
      detail: canFlags
        ? `${enabledFlagsCount}/${totalFlagsCount} مفعّل`
        : "للإدارة فقط",
    },
    {
      key: "subscription",
      label: "الاشتراك",
      available: canSubscriptions,
      detail: canSubscriptions
        ? planCode || "—"
        : isFeatureEnabled("subscriptions.enabled")
          ? "بدون صلاحية"
          : "غير مفعّل",
    },
  ];

  const loading =
    (canAudit && auditLoading) ||
    (canFlags && flagsLoading) ||
    (canSubscriptions && (plansLoading || subscriptionLoading));

  return {
    canAccess: canAudit || canReports || canFlags || canSubscriptions,
    canAudit,
    canReports,
    canFlags,
    canSubscriptions,
    loading,
    auditStats,
    actionChartData,
    recentAudit,
    enabledFlagsCount,
    totalFlagsCount,
    reportTypesCount: canReports ? REPORT_TYPES.length : null,
    planCode: canSubscriptions ? planCode : null,
    plansCount: canSubscriptions ? asList(plans).length : null,
    subscriptionEnd: canSubscriptions
      ? subscriptionMe?.subscription?.currentPeriodEnd || null
      : null,
    moduleStatuses,
  };
};
