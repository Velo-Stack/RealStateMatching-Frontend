import { AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";

const MAX_VISIBLE_PAGE_BUTTONS = 5;

const NotificationsList = ({
  notifications,
  markRead,
  isMarkReadPending,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  totalCount = 0,
}) => {
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
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              markRead={markRead}
              isMarkReadPending={isMarkReadPending}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111827]/35 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-400">
          إجمالي الإشعارات: <span className="font-semibold text-slate-200">{totalCount}</span>
        </p>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isMarkReadPending}
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
                  disabled={isMarkReadPending}
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
            disabled={currentPage >= totalPages || isMarkReadPending}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;
