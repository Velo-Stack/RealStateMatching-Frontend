import axios from 'axios';
import api from '../../../utils/api';
import { getApiBaseUrl } from '../../../utils/apiBaseUrl';

const publicApi = axios.create({
  baseURL: getApiBaseUrl(),
});

export const fetchJoinUsStatus = async () => {
  const { data } = await publicApi.get('/public/join-us/status');
  return data;
};

export const fetchJoinUsCities = async () => {
  const { data } = await publicApi.get('/public/join-us/cities');
  return data;
};

export const submitJoinApplication = async (formData) => {
  const { data } = await publicApi.post('/public/join-applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const fetchJoinApplications = async (status = '') => {
  const { data } = await api.get('/admin/join-applications', {
    params: status ? { status } : undefined,
  });
  return data;
};

export const fetchJoinApplicationStats = async () => {
  const { data } = await api.get('/admin/join-applications/stats');
  return data;
};

export const fetchJoinApplication = async (id) => {
  const { data } = await api.get(`/admin/join-applications/${id}`);
  return data;
};

export const updateJoinApplicationStatus = async (id, payload) => {
  const { data } = await api.patch(`/admin/join-applications/${id}/status`, payload);
  return data;
};

export const getJoinFilePreviewUrl = (applicationId, fileId) => {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const token = localStorage.getItem('token');
  return `${base}/admin/join-applications/${applicationId}/files/${fileId}/preview?token=${encodeURIComponent(token || '')}`;
};

export const getJoinFileDownloadUrl = (applicationId, fileId) => {
  const base = getApiBaseUrl().replace(/\/$/, '');
  return `${base}/admin/join-applications/${applicationId}/files/${fileId}`;
};
