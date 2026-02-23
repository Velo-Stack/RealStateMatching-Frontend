import { useQuery } from "@tanstack/react-query";
import { OFFERS_QUERY_KEY } from "../../offers/constants/offersConstants";
import { fetchOffers } from "../../offers/services/offersApi";

export const useDashboardOffersQuery = (enabled) =>
  useQuery({
    queryKey: OFFERS_QUERY_KEY,
    queryFn: fetchOffers,
    staleTime: 60_000,
    enabled,
  });
