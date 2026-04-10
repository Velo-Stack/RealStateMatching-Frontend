import { AnimatePresence } from "framer-motion";
import { Calendar, Scroll } from "phosphor-react";
import AuditLogItem from "./AuditLogItem";

const MAX_VISIBLE_PAGE_BUTTONS = 5;

const AuditLogsList = ({
  isLoading,
  isFetching,
  logs,
  groupedLogs,
  expandedLog,
  setExpandedLog,
  onShowDetails,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  totalCount = 0,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">جاري تحميل السجلات...</span>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
          <Scroll size={32} className="text-slate-500" />
        </div>
        <p className="text-slate-400 text-sm">
          لا توجد سجلات مطابقة للفلاتر الحالية
        </p>
      </div>
    );
  }

  const handleToggleExpand = (logId, isExpanded) => {
    setExpandedLog(isExpanded ? null : logId);
  };

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
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-sm text-slate-400">{date}</span>
            <span className="text-xs text-slate-600">
              ({dateLogs.length} عملية)
            </span>
          </div>

          <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            <AnimatePresence>
              {dateLogs.map((log, index) => (
                <AuditLogItem
                  key={log.id}
                  log={log}
                  index={index}
                  isExpanded={expandedLog === log.id}
                  onToggleExpand={handleToggleExpand}
                  onShowDetails={onShowDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111827]/35 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-400">
          إجمالي السجلات: <span className="font-semibold text-slate-200">{totalCount}</span>
        </p>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isFetching}
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
                  disabled={isFetching}
                  className={`h-8 min-w-8 rounded-lg border px-2 text-xs transition ${
                    pageNumber === currentPage
                      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/10"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isFetching}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsList;
