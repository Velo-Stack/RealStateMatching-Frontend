import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapRequestToForm } from "../utils/requestsUtils";
import RequestDetailsPanel from "./RequestDetailsPanel";
import RequestItem from "./RequestItem";

const RequestsList = ({ requests, isLoading, user, openEdit, confirmDelete }) => {
  const columns = [
    {
      header: "النوع",
      key: "type",
      render: (row) => <RequestItem request={row} type="type" />,
    },
    { header: "الاستخدام", key: "usage" },
    {
      header: "الموقع",
      key: "location",
      render: (row) => <RequestItem request={row} type="location" />,
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
  ];

  const actions = (request) => {
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
  };

  return (
    <Table columns={columns} data={requests} loading={isLoading} actions={actions} />
  );
};

export default RequestsList;
