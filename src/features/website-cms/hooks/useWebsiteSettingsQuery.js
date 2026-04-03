import { useQuery } from "@tanstack/react-query";
import { WEBSITE_CMS_QUERY_KEYS } from "../constants/websiteCmsQueryKeys";
import { fetchWebsiteSettings } from "../services/websiteCmsApi";

export const useWebsiteSettingsQuery = () =>
  useQuery({
    queryKey: WEBSITE_CMS_QUERY_KEYS.settings,
    queryFn: fetchWebsiteSettings,
  });
