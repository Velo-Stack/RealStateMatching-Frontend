import api from "../../../utils/api";

export const fetchRequests = async () => {
  const { data } = await api.get("/requests");
  return data;
};

export const createRequest = async (payload) => {
  const { data } = await api.post("/requests", payload);
  return data;
};

export const updateRequest = async ({ id, payload }) => {
  const { data } = await api.put(`/requests/${id}`, payload);
  return data;
};

export const deleteRequest = async (id) => {
  await api.delete(`/requests/${id}`);
};
