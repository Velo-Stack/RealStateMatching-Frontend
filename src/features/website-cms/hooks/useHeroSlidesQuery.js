import { useQuery } from "@tanstack/react-query";
import { WEBSITE_CMS_QUERY_KEYS } from "../constants/websiteCmsQueryKeys";
import { fetchHeroSlides } from "../services/websiteCmsApi";

export const useHeroSlidesQuery = () =>
  useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.heroSlides,
    queryFn: fetchHeroSlides,
  });
