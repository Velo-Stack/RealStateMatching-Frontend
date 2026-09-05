import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lightning, SquaresFour } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import {
  SIDEBAR_GROUP_META,
  SIDEBAR_GROUPS,
} from "../../../components/sidebar/sidebarNavConfig";
import { getSidebarNavigationItems } from "../../../components/sidebar/sidebarVisibility";
import { useGroupHubStats } from "../hooks/useGroupHubStats";
import AdminHubDashboard from "./AdminHubDashboard";
import CommunicationHubDashboard from "./CommunicationHubDashboard";
import EngagementHubDashboard from "./EngagementHubDashboard";
import OperationsHubDashboard from "./OperationsHubDashboard";
import SystemHubDashboard from "./SystemHubDashboard";
import ToolsHubDashboard from "./ToolsHubDashboard";
import WebsiteHubDashboard from "./WebsiteHubDashboard";

const GroupHubPage = () => {
  const { groupId } = useParams();
  const { user, profile } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();

  const meta = SIDEBAR_GROUP_META.find((group) => group.id === groupId);

  const visibleItems = getSidebarNavigationItems(
    user,
    isFeatureEnabled,
    profile,
  ).filter((item) => item.group === meta?.id);

  const { stats } = useGroupHubStats({
    groupId: meta?.id,
    user,
    visibleItemsCount: visibleItems.length,
  });

  if (!meta || meta.id === SIDEBAR_GROUPS.DASHBOARD) {
    return <Navigate to="/app" replace />;
  }

  if (visibleItems.length === 0) {
    return <Navigate to="/app" replace />;
  }

  // Dedicated hub dashboards (screens live in top GroupSubnav)
  if (meta.id === SIDEBAR_GROUPS.ENGAGEMENT) {
    return <EngagementHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.OPERATIONS) {
    return <OperationsHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.COMMUNICATION) {
    return <CommunicationHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.ADMIN) {
    return <AdminHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.TOOLS) {
    return <ToolsHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.SYSTEM) {
    return <SystemHubDashboard meta={meta} />;
  }

  if (meta.id === SIDEBAR_GROUPS.WEBSITE) {
    return <WebsiteHubDashboard meta={meta} />;
  }

  const GroupIcon = meta.icon;
  const quickActions = visibleItems.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 app-shell-control"
            style={{ color: "var(--accent)" }}
          >
            <GroupIcon size={24} weight="duotone" />
          </div>
          <div className="min-w-0">
            <h1
              className="text-xl lg:text-2xl font-bold m-0 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {meta.label}
            </h1>
            <p className="text-sm m-0 mt-1" style={{ color: "var(--text-dim)" }}>
              اختر الشاشة المطلوبة · {visibleItems.length} شاشات متاحة
            </p>
          </div>
        </div>
      </div>

      <div className="depth-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <SquaresFour
            size={18}
            weight="duotone"
            style={{ color: "var(--accent)" }}
          />
          <h3
            className="text-sm font-bold m-0"
            style={{ color: "var(--text-primary)" }}
          >
            إحصائيات {meta.label}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl px-3 py-3"
              style={{ background: "var(--shell-nav-hover-bg)" }}
            >
              <p
                className="text-[11px] m-0"
                style={{ color: "var(--text-dim)" }}
              >
                {stat.label}
              </p>
              <p
                className="text-xl font-bold m-0 mt-1 truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="depth-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightning
            size={18}
            weight="duotone"
            style={{ color: "var(--accent)" }}
          />
          <h3
            className="text-sm font-bold m-0"
            style={{ color: "var(--text-primary)" }}
          >
            إجراءات سريعة
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium no-underline app-shell-control"
              >
                <ItemIcon size={16} weight="duotone" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleItems.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.24) }}
            >
              <Link
                to={item.to}
                className="depth-card block p-5 h-full no-underline transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--accent-glow)",
                      color: "var(--accent)",
                    }}
                  >
                    <ItemIcon size={22} weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="text-base font-bold m-0 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </h2>
                    <p
                      className="text-xs m-0 mt-1 flex items-center gap-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      فتح الشاشة
                      <ArrowLeft size={12} />
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupHubPage;
