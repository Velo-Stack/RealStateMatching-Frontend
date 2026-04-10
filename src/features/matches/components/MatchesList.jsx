import { memo, useCallback, useMemo } from "react";
import { StatusBadge, STATUS_CONFIGS } from "../../../components/common";
import Table from "../../../components/Table";
import { inputClasses } from "../../../constants/styles";
import { STATUS_UPDATE_OPTIONS } from "../constants/matchesConstants";
import EmptyState from "./EmptyState";
import MatchDetailsPanel from "./MatchDetailsPanel";
import MatchItem from "./MatchItem";

const MAX_VISIBLE_PAGE_BUTTONS = 5;

const MatchesList = ({
  filteredMatches,
  isLoading,
  canUpdateStatus,
  updateStatus,
  onMatchClick,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  totalCount = 0,
}) => {
  const matchRows = filteredMatches || [];

  const columns = useMemo(
    () => [
    {
      header: "العرض",
      key: "offer",
      render: (row) => <MatchItem row={row} type="offer" />,
    },
    {
      header: "الطلب",
      key: "request",
      render: (row) => <MatchItem row={row} type="request" />,
    },
    {
      header: "نسبة التطابق",
      key: "score",
      render: (row) => <MatchItem row={row} type="score" />,
    },
    {
      header: "الحالة",
      key: "status",
      render: (row) => (
        <StatusBadge status={row.status} config={STATUS_CONFIGS[row.status]} />
      ),
    },
    ],
    [],
  );

  const actions = useCallback(
    (row) =>
      canUpdateStatus ? (
        <select
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateStatus({ id: row.id, status: e.target.value })}
          className={inputClasses}
        >
          {STATUS_UPDATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null,
    [canUpdateStatus, updateStatus],
  );

  const getMatchRowKey = useCallback(
    (match) =>
      String(
        match.id ??
          `${match.offerId || match.offer?.id || ""}-${match.requestId || match.request?.id || ""}`,
      ),
    [],
  );

  if (!isLoading && matchRows.length === 0) {
    return <EmptyState />;
  }

  const canPaginate = totalPages > 1;
  const halfWindow = Math.floor(MAX_VISIBLE_PAGE_BUTTONS / 2);
  let start = Math.max(1, currentPage - halfWindow);
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGE_BUTTONS - 1);
  if (end - start + 1 < MAX_VISIBLE_PAGE_BUTTONS) {
    start = Math.max(1, end - MAX_VISIBLE_PAGE_BUTTONS + 1);
  }
  const visiblePageNumbers = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  const goToPage = (pageNumber) => {
    if (!onPageChange) return;
    const normalizedPage = Math.min(totalPages, Math.max(1, pageNumber));
    if (normalizedPage === currentPage) return;
    onPageChange(normalizedPage);
  };

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={matchRows}
        loading={isLoading}
        actions={actions}
        onRowClick={onMatchClick}
        getRowKey={getMatchRowKey}
        virtualizedRowHeight={88}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111827]/35 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-400">
          إجمالي التطابقات: <span className="font-semibold text-slate-200">{totalCount}</span>
        </p>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            السابق
          </button>

          {canPaginate && (
            <div className="flex items-center gap-1">
              {visiblePageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => goToPage(pageNumber)}
                  className={`h-8 min-w-8 rounded-lg border px-2 text-xs transition ${
                    pageNumber === currentPage
                      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(MatchesList);
