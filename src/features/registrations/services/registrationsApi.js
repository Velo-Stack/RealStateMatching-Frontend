import axios from "axios";
import api from "../../../utils/api";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

export const fetchSelfRegistrationStatus = async () => {
  const { data } = await publicApi.get("/auth/self-registration-status");
  return data;
};

export const registerAccount = async (payload) => {
  const { data } = await publicApi.post("/auth/register", payload);
  return data;
};

export const fetchRegistrations = async (status = "PENDING") => {
  const { data } = await api.get("/admin/registrations", {
    params: status ? { status } : undefined,
  });
  return data;
};

export const approveRegistrationApi = async (id) => {
  const { data } = await api.post(`/admin/registrations/${id}/approve`);
  return data;
};

export const rejectRegistrationApi = async (id, reason) => {
  const { data } = await api.post(`/admin/registrations/${id}/reject`, { reason });
  return data;
};
