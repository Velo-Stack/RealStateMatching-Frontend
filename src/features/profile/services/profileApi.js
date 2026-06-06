import api from "../../../utils/api";

export const updateProfileApi = async (payload) => {
  const { data } = await api.patch("/auth/me", payload);
  return data;
};

export const uploadMyAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post("/auth/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteMyAvatarApi = async () => {
  const { data } = await api.delete("/auth/me/avatar");
  return data;
};
