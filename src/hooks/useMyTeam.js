import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { TEAMS_QUERY_KEYS } from '../shared/query/queryKeys';

/**
 * Hook لجلب معلومات فريق المستخدم الحالي
 */
const useMyTeam = () => {
    return useQuery({
        queryKey: TEAMS_QUERY_KEYS.myTeam,
        queryFn: async () => {
            const { data } = await api.get('/me/team');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useMyTeam;
