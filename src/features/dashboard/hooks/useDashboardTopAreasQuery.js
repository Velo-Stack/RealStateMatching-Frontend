import { useQuery } from "@tanstack/react-query";
import { fetchTopAreas } from "../services/dashboardApi";

export const useDashboardTopAreasQuery = (enabled) =>
  useQuery({
    queryKey: ["dashboard", "top-areas"],
    queryFn: fetchTopAreas,
    enabled,
  });
