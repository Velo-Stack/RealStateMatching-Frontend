import api from "../../../utils/api";

export const fetchOffices = async (params = {}) => {
  const { data } = await api.get("/offices", { params });
  return data;
};

export const fetchOffice = async (id) => {
  const { data } = await api.get(`/offices/${id}`);
  return data;
};

export const createOfficeApi = async (payload) => {
  const { data } = await api.post("/offices", payload);
  return data;
};

export const updateOfficeApi = async ({ id, payload }) => {
  const { data } = await api.put(`/offices/${id}`, payload);
  return data;
};

export const deactivateOfficeApi = async (id) => {
  const { data } = await api.delete(`/offices/${id}`);
  return data;
};

export const addOfficeMemberApi = async ({ officeId, userId, role }) => {
  const { data } = await api.post(`/offices/${officeId}/members`, { userId, role });
  return data;
};

export const removeOfficeMemberApi = async ({ officeId, userId }) => {
  const { data } = await api.delete(`/offices/${officeId}/members/${userId}`);
  return data;
};

export const fetchDistributionRules = async () => {
  const { data } = await api.get("/offices/admin/distribution-rules");
  return data;
};

export const createDistributionRuleApi = async (payload) => {
  const { data } = await api.post("/offices/admin/distribution-rules", payload);
  return data;
};

export const updateDistributionRuleApi = async ({ id, payload }) => {
  const { data } = await api.put(`/offices/admin/distribution-rules/${id}`, payload);
  return data;
};

export const fetchAssignedCount = async () => {
  const { data } = await api.get("/offices/me/assigned-count");
  return data;
};

export const reassignRequestApi = async ({ requestId, assignedToUserId }) => {
  const { data } = await api.post(`/requests/${requestId}/reassign`, { assignedToUserId });
  return data;
};
