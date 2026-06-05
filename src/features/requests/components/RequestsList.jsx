import { memo, useCallback, useMemo } from "react";
import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
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
  const { isFeatureEnabled } = useFeatureFlags();
  const showAssignee = isFeatureEnabled("request_distribution.enabled");

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
    ...(showAssignee
      ? [{
          header: "المسؤول",
          key: "assignee",
          render: (row) => (
            <span className="text-sm text-slate-300">
              {row.assignment?.assignee?.name || "—"}
            </span>
          ),
        }]
      : []),
    ],
    [showAssignee],
  );

  const actions = useCallback(
    (request) => {
      const requestResource = { ...request, __resource: "requests" };
      const canEditRequest = canEdit(requestResource, user);
      const canDeleteRequest = canDelete(requestResource, user);
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

      <div 
        className="flex flex-col gap-3 rounded-xl border px-4 py-3 md:flex-row md:items-center md:justify-between"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-default)',
        }}
      >
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          إجمالي الطلبات: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{totalItems}</span>
        </p>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isFetching}
            className="rounded-lg border px-3 py-1.5 text-xs transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
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
                className={`h-8 min-w-8 rounded-lg border px-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pageNumber === currentPage ? "font-semibold" : "hover:opacity-80"
                }`}
                style={{
                  borderColor: pageNumber === currentPage ? 'var(--accent)' : 'var(--border-default)',
                  backgroundColor: pageNumber === currentPage ? 'var(--accent-glow)' : 'var(--bg-card)',
                  color: pageNumber === currentPage ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isFetching}
            className="rounded-lg border px-3 py-1.5 text-xs transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(RequestsList);
