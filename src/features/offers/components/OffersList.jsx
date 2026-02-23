import { memo, useCallback, useMemo } from "react";
import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapOfferToForm } from "../utils/offersUtils";
import OfferDetailsPanel from "./OfferDetailsPanel";
import OfferItem from "./OfferItem";

const OffersList = ({ offers, isLoading, user, openEdit, confirmDelete, onOffersClick }) => {
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
    { header: "الاستخدام", key: "usage" },
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

  return (
    <Table
      columns={columns}
      data={offersWithPrev}
      loading={isLoading}
      actions={actions}
      onRowClick={onOffersClick}
      getRowKey={getOfferRowKey}
      virtualizedRowHeight={96}
    />
  );
};

export default memo(OffersList);
