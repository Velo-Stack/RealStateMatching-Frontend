import api from "../../../utils/api";

export const fetchOffersMap = async (params = {}) => {
  const { data } = await api.get("/offers/map", { params });
  return data;
};

export const fetchPublicOffersMap = async (params = {}) => {
  const { data } = await api.get("/public/offers/map", { params });
  return data;
};
