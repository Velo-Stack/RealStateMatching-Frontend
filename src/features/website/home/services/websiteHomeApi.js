import api from "../../../../utils/api";

export const fetchWebsiteHome = async () => {
  const { data } = await api.get("/website/home");
  return data;
};

export const fetchPublicSettings = async () => {
  const { data } = await api.get("/website/settings");
  return data;
};

export const fetchWebsiteStats = async () => {
  const { data } = await api.get("/website/stats");
  return data?.data;
};


