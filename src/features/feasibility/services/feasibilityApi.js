import api from "../../../utils/api";

export const fetchFeasibilityTemplates = async () => {
  const { data } = await api.get("/feasibility/templates");
  return data;
};

export const runFeasibilityQuickApi = async (payload) => {
  const { data } = await api.post("/feasibility/quick", payload);
  return data;
};

export const fetchOfferFeasibility = async (offerId) => {
  const { data } = await api.get(`/offers/${offerId}/feasibility`);
  return data;
};

export const exportFeasibilityPdfApi = async (studyId) => {
  const response = await api.post(`/feasibility/${studyId}/export-pdf`, null, {
    responseType: "blob",
  });
  return response.data;
};
