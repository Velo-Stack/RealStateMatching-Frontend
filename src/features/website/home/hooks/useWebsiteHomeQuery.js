import { useQuery } from "@tanstack/react-query";
import { fetchWebsiteHome } from "../services/websiteHomeApi";

export const useWebsiteHomeQuery = () =>
  useQuery({
    queryKey: ["website", "home"],
    queryFn: fetchWebsiteHome,
    staleTime: 60_000,
  });
