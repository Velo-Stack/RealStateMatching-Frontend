import { useQuery } from '@tanstack/react-query';
import api from '../../../../utils/api'; // Adjust depending on your actual api utility import path.

export const useInvestorsQuery = () =>
  useQuery({
    queryKey: ['public-investors'],
    queryFn: () => api.get('/public/investors').then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });
