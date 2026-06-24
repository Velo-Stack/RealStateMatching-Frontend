import { useQuery } from '@tanstack/react-query';
import { fetchJoinUsCities } from '../services/joinUsApi';

const useJoinUsCities = () => {
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['join-us', 'cities'],
    queryFn: fetchJoinUsCities,
    staleTime: 10 * 60 * 1000,
  });

  return {
    cities,
    cityOptions: cities.map((city) => ({
      value: String(city.id),
      label: city.name,
    })),
    isLoading,
  };
};

export default useJoinUsCities;
