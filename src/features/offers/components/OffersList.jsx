import { memo, useCallback, useMemo } from "react";
import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapOfferToForm } from "../utils/offersUtils";
import OfferDetailsPanel from "./OfferDetailsPanel";
import OfferItem from "./OfferItem";
import { getLabelFromArray, USAGE_CLASSIFICATION_OPTIONS } from "../../../constants/enums";

const MAX_VISIBLE_PAGE_BUTTONS = 5;

const OffersList = ({
  offers,
  isLoading,
  status,
  isFetching,
  error,
  user,
  openEdit,
  confirmDelete,
  onOffersClick,
  currentPage = 1,
  onPageChange,
  pagination,
}) => {
  const offersWithPrev = useMemo(
    () =>
      offers.map((offer, index) => ({
        ...offer,
        __prevCreatedAt: index > 0 ? offers[index - 1]?.createdAt : null,
      })),
    [offers],
  );

  const columns = useMemo(
    () => [
    {
      header: "النوع",
      key: "type",
      render: (row) => <OfferItem offer={row} type="type" />,
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
        <OfferItem
          offer={row}
          type="location"
          createdAt={row.createdAt}
          prevCreatedAt={row.__prevCreatedAt}
        />
      ),
    },
    {
      header: "المساحة",
      key: "area",
      render: (row) => <OfferDetailsPanel offer={row} type="area" />,
    },
    {
      header: "السعر",
      key: "price",
      render: (row) => <OfferDetailsPanel offer={row} type="price" />,
    },
    {
      header: "الحصرية",
      key: "exclusivity",
      render: (row) => <OfferDetailsPanel offer={row} type="exclusivity" />,
    },
    ],
    [],
  );

  const actions = useCallback(
    (offer) => {
      const canEditOffer = canEdit(offer, user);
      const canDeleteOffer = canDelete(offer, user);
      if (!canEditOffer && !canDeleteOffer) return null;

      return (
        <ActionButtons
          onEdit={() => openEdit(offer, mapOfferToForm)}
          onDelete={() => confirmDelete(offer)}
          canEdit={canEditOffer}
          canDelete={canDeleteOffer}
        />
      );
    },
    [confirmDelete, openEdit, user],
  );

  const getOfferRowKey = useCallback(
    (offer) =>
      String(
        offer.id ??
          `${offer.createdAt || ""}-${offer.cityId || ""}-${offer.priceFrom || offer.priceTo || ""}`,
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
        data={offersWithPrev}
        loading={isLoading}
        status={status}
        isFetching={isFetching}
        error={error}
        actions={actions}
        onRowClick={onOffersClick}
        getRowKey={getOfferRowKey}
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
          إجمالي العروض: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{totalItems}</span>
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

export default memo(OffersList);
