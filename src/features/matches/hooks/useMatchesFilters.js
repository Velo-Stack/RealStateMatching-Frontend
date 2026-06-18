import { useState } from "react";
import { DEFAULT_STATUS_FILTER } from "../constants/matchesConstants";

export const useMatchesFilters = () => {
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);

  return {
    statusFilter,
    setStatusFilter,
  };
};
