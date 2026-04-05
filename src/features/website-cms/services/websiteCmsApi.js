import api from "../../../utils/api";

export const fetchWebsiteSettings = async () => {
  const { data } = await api.get("/admin/website/settings");
  return data;
};

export const updateWebsiteSettingsApi = async (payload) => {
  const { data } = await api.put("/admin/website/settings", payload);
  return data;
};

export const fetchHeroSlides = async () => {
  const { data } = await api.get("/admin/website/hero-slides", {
    params: { includeInactive: true },
  });
  return data;
};

export const createHeroSlideApi = async (payload) => {
  const { data } = await api.post("/admin/website/hero-slides", payload);
  return data;
};

export const updateHeroSlideApi = async ({ id, payload }) => {
  const { data } = await api.put(`/admin/website/hero-slides/${id}`, payload);
  return data;
};

export const toggleHeroSlideStatusApi = async ({ id, isActive }) => {
  const { data } = await api.patch(`/admin/website/hero-slides/${id}/status`, {
    isActive,
  });
  return data;
};

export const deleteHeroSlideApi = async (id) => {
  const { data } = await api.delete(`/admin/website/hero-slides/${id}`);
  return data;
};

export const fetchWebsiteSections = async () => {
  const { data } = await api.get("/admin/website/sections", {
    params: { includeInactive: true },
  });
  return data;
};

export const createWebsiteSectionApi = async (payload) => {
  const { data } = await api.post("/admin/website/sections", payload);
  return data;
};

export const updateWebsiteSectionApi = async ({ id, payload }) => {
  const { data } = await api.put(`/admin/website/sections/${id}`, payload);
  return data;
};

export const deleteWebsiteSectionApi = async (id) => {
  const { data } = await api.delete(`/admin/website/sections/${id}`);
  return data;
};

export const fetchFeaturedOffers = async () => {
  const { data } = await api.get("/admin/website/featured-offers", {
    params: { includeInactive: true },
  });
  return data;
};

export const createFeaturedOfferApi = async (payload) => {
  const { data } = await api.post("/admin/website/featured-offers", payload);
  return data;
};

export const updateFeaturedOfferApi = async ({ id, payload }) => {
  const { data } = await api.put(`/admin/website/featured-offers/${id}`, payload);
  return data;
};

export const deleteFeaturedOfferApi = async (id) => {
  const { data } = await api.delete(`/admin/website/featured-offers/${id}`);
  return data;
};

export const uploadWebsiteImageApi = async ({ folder = "website", file }) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post(`/admin/uploads/${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
