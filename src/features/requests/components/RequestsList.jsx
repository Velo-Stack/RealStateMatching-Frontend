import { memo, useCallback, useMemo } from "react";
import { ActionButtons } from "../../../components/common";
import Table from "../../../components/Table";
import { canDelete, canEdit } from "../../../utils/rbac";
import { mapRequestToForm } from "../utils/requestsUtils";
import RequestDetailsPanel from "./RequestDetailsPanel";
import RequestItem from "./RequestItem";

const RequestsList = ({ requests, isLoading, user, openEdit, confirmDelete, onRequestsClick }) => {
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
    { header: "الاستخدام", key: "usage" },
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

  return (
    <Table
      columns={columns}
      data={requestsWithPrev}
      loading={isLoading}
      actions={actions}
      onRowClick={onRequestsClick}
      getRowKey={getRequestRowKey}
      virtualizedRowHeight={96}
    />
  );
};

export default memo(RequestsList);
