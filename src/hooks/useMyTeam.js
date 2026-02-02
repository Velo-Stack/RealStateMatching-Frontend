import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

/**
 * Hook لجلب معلومات فريق المستخدم الحالي
 */
const useMyTeam = () => {
    return useQuery({
        queryKey: ['myTeam'],
        queryFn: async () => {
            const { data } = await api.get('/me/team');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useMyTeam;
