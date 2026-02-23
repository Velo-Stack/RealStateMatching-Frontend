import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { META_QUERY_KEYS } from '../shared/query/queryKeys';

const META_STALE_TIME = 10 * 60 * 1000;

const toNumericIdOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const useMeta = () => {
  const { data: enums, isLoading: enumsLoading } = useQuery({
    queryKey: META_QUERY_KEYS.enums,
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/meta/enums', { signal });
      return data;
    },
    staleTime: META_STALE_TIME,
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: META_QUERY_KEYS.cities,
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/locations/cities', { signal });
      return data;
    },
    staleTime: META_STALE_TIME,
  });

  return {
    enums,
    enumsLoading,
    cities,
    citiesLoading,
    cityOptions: cities.map((city) => ({
      value: city.id,
      label: city.name,
    })),
    isLoading: enumsLoading || citiesLoading,
  };
};

export const useNeighborhoods = (cityId) => {
  const normalizedCityId = toNumericIdOrNull(cityId);

  const {
    data: neighborhoods = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: META_QUERY_KEYS.neighborhoods(normalizedCityId),
    queryFn: async ({ signal }) => {
      if (!normalizedCityId) return [];
      const { data } = await api.get(`/locations/neighborhoods?cityId=${normalizedCityId}`, { signal });
      return data;
    },
    staleTime: META_STALE_TIME,
    enabled: !!normalizedCityId,
  });

  return {
    neighborhoods,
    isLoading: isLoading || isFetching,
    neighborhoodOptions: neighborhoods.map((neighborhood) => ({
      value: neighborhood.id,
      label: neighborhood.name,
    })),
  };
};

export default useMeta;