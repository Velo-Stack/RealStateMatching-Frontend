import api from "../../../utils/api";

export const fetchComparables = async (params = {}) => {
  const { data } = await api.get("/lands/comparables", { params });
  return data;
};

export const createComparableApi = async (payload) => {
  const { data } = await api.post("/lands/comparables", payload);
  return data;
};

export const updateComparableApi = async ({ id, payload }) => {
  const { data } = await api.put(`/lands/comparables/${id}`, payload);
  return data;
};

export const deleteComparableApi = async (id) => {
  const { data } = await api.delete(`/lands/comparables/${id}`);
  return data;
};

export const evaluateLandApi = async (payload) => {
  const { data } = await api.post("/lands/evaluate", payload);
  return data;
};

export const fetchOfferEvaluation = async (offerId) => {
  const { data } = await api.get(`/offers/${offerId}/evaluation`);
  return data;
};
