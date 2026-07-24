import api from "../../../utils/api";

// Stats
export const getInvestorStatsApi = async () => (await api.get("/admin/investors/stats")).data?.data;
export const createInvestorStatApi = async (data) => (await api.post("/admin/investors/stats", data)).data?.data;
export const updateInvestorStatApi = async ({ id, ...data }) => (await api.put(`/admin/investors/stats/${id}`, data)).data?.data;
export const deleteInvestorStatApi = async (id) => (await api.delete(`/admin/investors/stats/${id}`)).data;

// Content
export const getInvestorContentApi = async (key) => (await api.get(`/admin/investors/content/${key}`)).data?.data;
export const upsertInvestorContentApi = async ({ key, ...data }) => (await api.put(`/admin/investors/content/${key}`, data)).data?.data;

// Events
export const getInvestorEventsApi = async () => (await api.get("/admin/investors/events")).data?.data;
export const createInvestorEventApi = async (data) => (await api.post("/admin/investors/events", data)).data?.data;
export const updateInvestorEventApi = async ({ id, ...data }) => (await api.put(`/admin/investors/events/${id}`, data)).data?.data;
export const deleteInvestorEventApi = async (id) => (await api.delete(`/admin/investors/events/${id}`)).data;

// Announcements
export const getInvestorAnnouncementsApi = async () => (await api.get("/admin/investors/announcements")).data?.data;
export const createInvestorAnnouncementApi = async (data) => (await api.post("/admin/investors/announcements", data)).data?.data;
export const updateInvestorAnnouncementApi = async ({ id, ...data }) => (await api.put(`/admin/investors/announcements/${id}`, data)).data?.data;
export const deleteInvestorAnnouncementApi = async (id) => (await api.delete(`/admin/investors/announcements/${id}`)).data;

// Advantages
export const getInvestorAdvantagesApi = async () => (await api.get("/admin/investors/advantages")).data?.data;
export const createInvestorAdvantageApi = async (data) => (await api.post("/admin/investors/advantages", data)).data?.data;
export const updateInvestorAdvantageApi = async ({ id, ...data }) => (await api.put(`/admin/investors/advantages/${id}`, data)).data?.data;
export const deleteInvestorAdvantageApi = async (id) => (await api.delete(`/admin/investors/advantages/${id}`)).data;
