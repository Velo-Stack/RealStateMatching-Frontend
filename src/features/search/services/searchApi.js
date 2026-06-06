import api from "../../../utils/api";
import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
});

export const searchOffersApi = async (params) => {
  const { data } = await api.get("/search/offers", { params });
  return data;
};

export const searchRequestsApi = async (params) => {
  const { data } = await api.get("/search/requests", { params });
  return data;
};

export const publicSearchOffersApi = async (params) => {
  const { data } = await publicApi.get("/public/search/offers", { params });
  return data;
};

export const fetchSavedSearches = async () => {
  const { data } = await api.get("/saved-searches");
  return data;
};

export const createSavedSearchApi = async (payload) => {
  const { data } = await api.post("/saved-searches", payload);
  return data;
};

export const deleteSavedSearchApi = async (id) => {
  const { data } = await api.delete(`/saved-searches/${id}`);
  return data;
};
