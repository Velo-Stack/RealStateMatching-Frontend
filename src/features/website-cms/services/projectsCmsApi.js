import api from '../../../utils/api';

export const fetchAdminProjects = () =>
  api.get('/admin/projects').then(r => r.data.data);

export const fetchAdminProject = (id) =>
  api.get(`/admin/projects/${id}`).then(r => r.data.data);

export const createProjectApi = (data) =>
  api.post('/admin/projects', data).then(r => r.data.data);

export const updateProjectApi = (id, data) =>
  api.put(`/admin/projects/${id}`, data).then(r => r.data.data);

export const deleteProjectApi = (id) =>
  api.delete(`/admin/projects/${id}`);

export const patchProjectStatusApi = (id, data) =>
  api.patch(`/admin/projects/${id}/status`, data).then(r => r.data.data);

export const reorderProjectsApi = (order) =>
  api.patch('/admin/projects/reorder', { order });

export const uploadProjectCoverApi = (id, file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post(`/admin/projects/${id}/cover`, form).then(r => r.data.data);
};

export const deleteProjectCoverApi = (id) =>
  api.delete(`/admin/projects/${id}/cover`);

export const uploadProjectGalleryApi = (id, files) => {
  const form = new FormData();
  files.forEach(f => form.append('images', f));
  return api.post(`/admin/projects/${id}/gallery`, form).then(r => r.data.data);
};

export const deleteGalleryImageApi = (id, filename) =>
  api.delete(`/admin/projects/${id}/gallery/${filename}`).then(r => r.data.data);
