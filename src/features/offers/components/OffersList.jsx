import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapOfferToForm } from "../utils/offersUtils";
import OfferDetailsPanel from "./OfferDetailsPanel";
import OfferItem from "./OfferItem";

const OffersList = ({ offers, isLoading, user, openEdit, confirmDelete }) => {
  const columns = [
    {
      header: "النوع",
      key: "type",
      render: (row) => <OfferItem offer={row} type="type" />,
    },
    { header: "الاستخدام", key: "usage" },
    {
      header: "الموقع",
      key: "location",
      render: (row) => <OfferItem offer={row} type="location" />,
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
  ];

  const actions = (offer) => {
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
  };

  return <Table columns={columns} data={offers} loading={isLoading} actions={actions} />;
};

export default OffersList;
