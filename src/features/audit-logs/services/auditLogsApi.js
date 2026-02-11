import api from "../../../utils/api";

export const fetchAuditLogs = async (filters) => {
  const params = {};

  if (filters.resource) params.resource = filters.resource;
  if (filters.action) params.action = filters.action;
  if (filters.userId) params.userId = Number(filters.userId);
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  const { data } = await api.get("/audit-logs", { params });
  return data;
};

export const fetchAuditLogUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};
