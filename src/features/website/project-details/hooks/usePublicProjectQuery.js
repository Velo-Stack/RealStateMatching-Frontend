import { useQuery } from '@tanstack/react-query';
import api from '../../../../utils/api';

export const usePublicProjectQuery = (slug) =>
  useQuery({
    queryKey: ['public-project', slug],
    queryFn: () => api.get(`/public/projects/${slug}`).then(r => r.data.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
