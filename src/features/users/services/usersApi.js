import api from "../../../utils/api";

export const fetchUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const fetchUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
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

export const createSubmissionLinkApi = async ({ userId, expiresInDays, allowedActions }) => {
  const { data } = await api.post(`/users/${userId}/submission-link`, {
    expiresInDays,
    allowedActions,
  });
  return data;
};

export const fetchPermissionsApi = async () => {
  const { data } = await api.get("/permissions");
  return data;
};

export const fetchUserPermissionsApi = async (id) => {
  const { data } = await api.get(`/users/${id}/permissions`);
  return data;
};

export const updateUserPermissionsApi = async ({ id, payload }) => {
  const { data } = await api.put(`/users/${id}/permissions`, payload);
  return data;
};

export const fetchRolePermissionsApi = async (role) => {
  const { data } = await api.get(`/roles/${role}/permissions`);
  return data;
};

export const updateRolePermissionsApi = async ({ role, payload }) => {
  const { data } = await api.put(`/roles/${role}/permissions`, payload);
  return data;
};

export const uploadUserAvatarApi = async ({ id, file }) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post(`/users/${id}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteUserAvatarApi = async (id) => {
  const { data } = await api.delete(`/users/${id}/avatar`);
  return data;
};
