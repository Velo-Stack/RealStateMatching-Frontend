import api from "../../../utils/api";

export const fetchUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createUserApi = async (payload) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUserApi = async ({ id, payload }) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const toggleUserStatusApi = async ({ id, status }) => {
  const { data } = await api.patch(`/users/${id}/status`, { status });
  return data;
};

export const deleteUserApi = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
