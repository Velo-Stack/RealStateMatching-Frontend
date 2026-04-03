import { useQuery } from "@tanstack/react-query";
import { WEBSITE_CMS_QUERY_KEYS } from "../constants/websiteCmsQueryKeys";
import { fetchWebsiteSections } from "../services/websiteCmsApi";

export const useWebsiteSectionsQuery = () =>
  useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.sections,
    queryFn: fetchWebsiteSections,
  });
