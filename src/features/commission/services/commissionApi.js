import api from "../../../utils/api";

export const fetchCommissionRules = async () => {
  const { data } = await api.get("/tools/commission/rules");
  return data;
};

export const calculateCommissionApi = async (payload) => {
  const { data } = await api.post("/tools/commission/calculate", payload);
  return data;
};

export const saveCommissionApi = async (payload) => {
  const { data } = await api.post("/tools/commission/save", payload);
  return data;
};

export const fetchOfferCommission = async (offerId) => {
  const { data } = await api.get(`/offers/${offerId}/commission`);
  return data;
};

export const createCommissionRuleApi = async (payload) => {
  const { data } = await api.post("/tools/commission/rules", payload);
  return data;
};

export const updateCommissionRuleApi = async ({ id, payload }) => {
  const { data } = await api.put(`/tools/commission/rules/${id}`, payload);
  return data;
};
