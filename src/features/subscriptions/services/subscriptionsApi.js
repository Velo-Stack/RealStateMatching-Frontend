import api from "../../../utils/api";
import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

export const fetchPublicPlans = async () => {
  const { data } = await publicApi.get("/public/plans");
  return data;
};

export const fetchPlans = async () => {
  const { data } = await api.get("/subscriptions/plans");
  return data;
};

export const fetchMySubscription = async () => {
  const { data } = await api.get("/subscriptions/me");
  return data;
};

export const fetchEntitlements = async () => {
  const { data } = await api.get("/subscriptions/entitlements");
  return data;
};

export const checkoutPlanApi = async (planCode) => {
  const { data } = await api.post("/subscriptions/checkout", { planCode });
  return data;
};

export const confirmMockPaymentApi = async (providerRef) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/webhooks/payments/mock`,
    { providerRef, status: "SUCCESS" }
  );
  return data;
};
