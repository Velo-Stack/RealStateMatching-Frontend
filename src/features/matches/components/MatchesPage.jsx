import { useMatchesData } from "../hooks/useMatchesData";
import { useMatchesFilters } from "../hooks/useMatchesFilters";
import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, SlidersHorizontal, Archive } from "phosphor-react";
import MatchDetailsModal from "./MatchDetailsModal";
import MatchesFilters from "./MatchesFilters";
import MatchesHeader from "./MatchesHeader";
import MatchesList from "./MatchesList";
import MatchesStats from "./MatchesStats";
import OfferDetailsModal from "../../offers/components/OfferDetailsModal";
import RequestDetailsModal from "../../requests/components/RequestDetailsModal";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";

// Lazy-load للتبويبات الخاصة بالمسؤول فقط (لا تُحمَّل لغير المسؤول)
const MatchingRuleEditor   = lazy(() => import("./MatchingRuleEditor"));
const MatchingSnapshotsList = lazy(() => import("./MatchingSnapshotsList"));

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const ALL_TABS = [
  {
    key: "matches",
    label: "التطابقات",
    icon: Handshake,
    adminOnly: false,
  },
  {
    key: "rule",
    label: "قاعدة التطابق",
    icon: SlidersHorizontal,
    adminOnly: true,
  },
  {
    key: "snapshots",
    label: "سجل القواعد",
    icon: Archive,
    adminOnly: true,
  },
];

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TabBar = ({ tabs, activeTab, onTabChange }) => (
  <div
    role="tablist"
    aria-label="أقسام التطابقات"
    className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#111827]/60 p-1 w-fit"
  >
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.key;
      return (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            isActive
              ? "text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {isActive && (
            <motion.span
              layoutId="matches-active-tab"
              className="absolute inset-0 rounded-lg bg-white/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Icon
            size={15}
            weight={isActive ? "fill" : "regular"}
            className={`relative z-10 ${isActive ? "text-emerald-400" : ""}`}
          />
          <span className="relative z-10 hidden sm:inline">{tab.label}</span>
        </button>
      );
    })}
  </div>
);

// ─── Lazy Tab Fallback ────────────────────────────────────────────────────────

const TabFallback = () => (
  <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
    جاري تحميل القسم...
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const MatchesPage = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return tab && ["matches", "rule", "snapshots"].includes(tab) ? tab : "matches";
  });

  const [selectedMatch,   setSelectedMatch]   = useState(null);
  const [selectedOffer,   setSelectedOffer]   = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage,     setCurrentPage]     = useState(1);

  const {
    statusFilter,
    setStatusFilter,
    minScoreFilter,
    setMinScoreFilter,
  } = useMatchesFilters();

  const {
    matches,
    pagination,
    isLoading,
    updateStatus,
    stats,
    canUpdateStatus,
  } = useMatchesData({ statusFilter, currentPage });

  // فلترة التطابقات محلياً في الفرونت بناءً على نسبة التطابق المختارة
  const displayedMatches = useMemo(() => {
    if (!minScoreFilter || minScoreFilter === "ALL") return matches;
    const minThreshold = Number(minScoreFilter);
    return matches.filter((m) => {
      const parsed = Number(String(m.score ?? "").replace(/,/g, ""));
      if (!Number.isFinite(parsed)) return false;
      const scorePercent = parsed <= 1 && parsed > 0 ? parsed * 100 : parsed;
      return scorePercent >= minThreshold;
    });
  }, [matches, minScoreFilter]);

  // معالجة deep-link للـ matchId
  useEffect(() => {
    const matchId = searchParams.get("matchId");
    if (matchId && matches.length > 0) {
      const match = matches.find((m) => m.id === parseInt(matchId, 10));
      if (match) {
        setSelectedMatch(match);
        searchParams.delete("matchId");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, matches, setSearchParams]);

  // مزامنة التبويب مع الـ URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === "matches") {
        next.delete("tab");
      } else {
        next.set("tab", tab);
      }
      return next;
    }, { replace: true });
  };

  const handleStatusFilterChange = (nextStatus) => {
    setStatusFilter(nextStatus);
    setCurrentPage(1);
  };

  const handleMinScoreFilterChange = (nextScore) => {
    setMinScoreFilter(nextScore);
  };

  // الـ tabs المرئية حسب الصلاحية
  const visibleTabs = isAdmin ? ALL_TABS : ALL_TABS.filter((t) => !t.adminOnly);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stats — تظهر دايماً */}
      <MatchesStats stats={stats} matches={matches} />

      {/* Tab Bar + Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <TabBar
          tabs={visibleTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Filters — تظهر فقط في تبويب التطابقات */}
        <AnimatePresence mode="wait">
          {activeTab === "matches" && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between sm:justify-end gap-3 flex-wrap"
            >
              <MatchesHeader
                filteredCount={displayedMatches.length}
                totalCount={stats.total}
              />
              <MatchesFilters
                statusFilter={statusFilter}
                setStatusFilter={handleStatusFilterChange}
                minScoreFilter={minScoreFilter}
                setMinScoreFilter={handleMinScoreFilterChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "matches" && (
          <motion.div
            key="matches-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <MatchesList
              filteredMatches={displayedMatches}
              isLoading={isLoading}
              canUpdateStatus={canUpdateStatus}
              updateStatus={updateStatus}
              onMatchClick={setSelectedMatch}
              currentPage={pagination.page}
              onPageChange={setCurrentPage}
              totalPages={pagination.totalPages}
              totalCount={displayedMatches.length}
            />
          </motion.div>
        )}

        {activeTab === "rule" && (
          <motion.div
            key="rule-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<TabFallback />}>
              <MatchingRuleEditor />
            </Suspense>
          </motion.div>
        )}

        {activeTab === "snapshots" && (
          <motion.div
            key="snapshots-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<TabFallback />}>
              <MatchingSnapshotsList />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <MatchDetailsModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        match={selectedMatch}
        onOpenOffer={(offer) => setSelectedOffer(offer)}
        onOpenRequest={(request) => setSelectedRequest(request)}
      />
      <OfferDetailsModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
      />
      <RequestDetailsModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
};

export default MatchesPage;
