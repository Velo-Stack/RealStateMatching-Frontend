import { memo, useCallback, useMemo } from "react";
import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapRequestToForm } from "../utils/requestsUtils";
import RequestDetailsPanel from "./RequestDetailsPanel";
import RequestItem from "./RequestItem";
import { getLabelFromArray, USAGE_CLASSIFICATION_OPTIONS } from "../../../constants/enums";

const MAX_VISIBLE_PAGE_BUTTONS = 5;

const RequestsList = ({
  requests,
  isLoading,
  isFetching,
  user,
  openEdit,
  confirmDelete,
  onRequestsClick,
  currentPage = 1,
  onPageChange,
  pagination,
}) => {
  const requestsWithPrev = useMemo(
    () =>
      requests.map((request, index) => ({
        ...request,
        __prevCreatedAt: index > 0 ? requests[index - 1]?.createdAt : null,
      })),
    [requests],
  );

  const columns = useMemo(
    () => [
    {
      header: "النوع",
      key: "type",
      render: (row) => <RequestItem request={row} type="type" />,
    },
    { 
      header: "الاستخدام", 
      key: "usage",
      render: (row) => getLabelFromArray(USAGE_CLASSIFICATION_OPTIONS, row.usage)
    },
    {
      header: "الموقع",
      key: "location",
      render: (row) => (
        <RequestItem
          request={row}
          type="location"
          createdAt={row.createdAt}
          prevCreatedAt={row.__prevCreatedAt}
        />
      ),
    },
    {
      header: "المساحة",
      key: "area",
      render: (row) => <RequestDetailsPanel request={row} type="area" />,
    },
    {
      header: "الميزانية",
      key: "budget",
      render: (row) => <RequestDetailsPanel request={row} type="budget" />,
    },
    {
      header: "الأولوية",
      key: "priority",
      render: (row) => <RequestDetailsPanel request={row} type="priority" />,
    },
    ],
    [],
  );

  const actions = useCallback(
    (request) => {
      const canEditRequest = canEdit(request, user);
      const canDeleteRequest = canDelete(request, user);
      if (!canEditRequest && !canDeleteRequest) return null;

      return (
        <ActionButtons
          onEdit={() => openEdit(request, mapRequestToForm)}
          onDelete={() => confirmDelete(request)}
          canEdit={canEditRequest}
          canDelete={canDeleteRequest}
        />
      );
    },
    [confirmDelete, openEdit, user],
  );

  const getRequestRowKey = useCallback(
    (request) =>
      String(
        request.id ??
          `${request.createdAt || ""}-${request.cityId || ""}-${request.budgetFrom || request.budgetTo || ""}`,
      ),
    [],
  );

  const totalPages = Math.max(1, Number(pagination?.totalPages) || 1);
  const totalItems = Number(pagination?.total) || 0;
  const canPaginate = totalPages > 1;

  const visiblePageNumbers = useMemo(() => {
    if (!canPaginate) return [1];

    const halfWindow = Math.floor(MAX_VISIBLE_PAGE_BUTTONS / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(totalPages, start + MAX_VISIBLE_PAGE_BUTTONS - 1);

    if (end - start + 1 < MAX_VISIBLE_PAGE_BUTTONS) {
      start = Math.max(1, end - MAX_VISIBLE_PAGE_BUTTONS + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [canPaginate, currentPage, totalPages]);

  const goToPage = useCallback(
    (pageNumber) => {
      if (!onPageChange) return;
      const normalizedPage = Math.min(totalPages, Math.max(1, pageNumber));
      if (normalizedPage === currentPage) return;
      onPageChange(normalizedPage);
    },
    [currentPage, onPageChange, totalPages],
  );

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={requestsWithPrev}
        loading={isLoading}
        actions={actions}
        onRowClick={onRequestsClick}
        getRowKey={getRequestRowKey}
        virtualizedRowHeight={96}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111827]/35 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-400">
          إجمالي الطلبات: <span className="font-semibold text-slate-200">{totalItems}</span>
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

export default memo(RequestsList);
