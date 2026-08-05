import axios from "axios";
import api from "../../../utils/api";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
});

export const fetchSelfRegistrationStatus = async () => {
  const { data } = await publicApi.get("/auth/self-registration-status");
  return data;
};

export const registerAccount = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await publicApi.post("/auth/register", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
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

export const fetchProtectedRegistrationFileBlobApi = async (registrationId, fileId) => {
  const response = await api.get(`/admin/registrations/${registrationId}/files/${fileId}/download`, {
    responseType: "blob",
  });
  const contentType = response.headers["content-type"] || "application/octet-stream";
  const blob = new Blob([response.data], { type: contentType });
  const blobUrl = window.URL.createObjectURL(blob);
  return { blob, blobUrl, contentType };
};

export const downloadProtectedRegistrationFileApi = async (registrationId, fileId, originalName = "document") => {
  const { blobUrl } = await fetchProtectedRegistrationFileBlobApi(registrationId, fileId);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = originalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
};
