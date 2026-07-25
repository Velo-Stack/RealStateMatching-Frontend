import { useQuery } from '@tanstack/react-query';
import api from '../../../../utils/api';

export const usePublicProjectsQuery = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.status) params.append('status', filters.status);
  if (filters.city) params.append('city', filters.city);

  return useQuery({
    queryKey: ['public-projects', filters],
    queryFn: () => api.get(`/public/projects?${params.toString()}`).then(r => r.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
