import api from "../../../utils/api";

export const fetchOffers = async (filters = {}) => {
  const { data } = await api.get("/offers", { params: filters });
  return data;
};

export const createOffer = async (payload) => {
  const { data } = await api.post("/offers", payload);
  return data;
};

export const updateOffer = async ({ id, payload }) => {
  const { data } = await api.put(`/offers/${id}`, payload);
  return data;
};

export const deleteOffer = async (id) => {
  await api.delete(`/offers/${id}`);
};
