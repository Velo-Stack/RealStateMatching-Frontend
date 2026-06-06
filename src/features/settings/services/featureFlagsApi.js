import api from "../../../utils/api";

export const fetchFeatureFlags = async () => {
  const { data } = await api.get("/admin/feature-flags");
  return data;
};

export const updateFeatureFlag = async ({ key, enabled }) => {
  const { data } = await api.put(`/admin/feature-flags/${key}`, { enabled });
  return data;
};

export const fetchPublicFeatureFlags = async () => {
  const { data } = await api.get("/public/feature-flags");
  return data;
};
