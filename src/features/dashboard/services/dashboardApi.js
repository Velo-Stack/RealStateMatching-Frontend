import api from "../../../utils/api";

export const fetchDashboardSummary = async () => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};

export const fetchTopBrokers = async () => {
  const { data } = await api.get("/dashboard/top-brokers");
  return data;
};

export const fetchTopAreas = async () => {
  const { data } = await api.get("/dashboard/top-areas");
  return data;
};
