import { useQuery } from "@tanstack/react-query";
import {
  fetchWebsiteHome,
  fetchPublicSettings,
  fetchWebsiteStats,
} from "../services/websiteHomeApi";

export const useWebsiteHomeQuery = () =>
  useQuery({
    queryKey: ["website", "home"],
    queryFn: fetchWebsiteHome,
    staleTime: 60_000,
  });

export const usePublicSettingsQuery = () =>
  useQuery({
    queryKey: ["website", "public-settings"],
    queryFn: fetchPublicSettings,
    staleTime: 5 * 60_000,
  });

export const useWebsiteStatsQuery = () =>
  useQuery({
    queryKey: ["website", "stats"],
    queryFn: fetchWebsiteStats,
    staleTime: 60_000,
  });


