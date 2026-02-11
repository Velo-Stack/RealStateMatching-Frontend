import { useQuery } from "@tanstack/react-query";
import { fetchTopBrokers } from "../services/dashboardApi";

export const useDashboardTopBrokersQuery = (enabled) =>
  useQuery({
    queryKey: ["dashboard", "top-brokers"],
    queryFn: fetchTopBrokers,
    enabled,
  });
