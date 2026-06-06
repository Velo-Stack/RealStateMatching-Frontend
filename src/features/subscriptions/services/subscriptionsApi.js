import api from "../../../utils/api";
import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
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
    `${getApiBaseUrl()}/webhooks/payments/mock`,
    { providerRef, status: "SUCCESS" }
  );
  return data;
};
