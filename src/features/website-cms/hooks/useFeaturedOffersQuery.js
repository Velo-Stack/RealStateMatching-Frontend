import { useQuery } from "@tanstack/react-query";
import { WEBSITE_CMS_QUERY_KEYS } from "../constants/websiteCmsQueryKeys";
import { fetchFeaturedOffers } from "../services/websiteCmsApi";

export const useFeaturedOffersQuery = () =>
  useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.featuredOffers,
    queryFn: fetchFeaturedOffers,
  });
