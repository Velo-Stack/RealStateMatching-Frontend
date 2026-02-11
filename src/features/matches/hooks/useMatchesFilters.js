import { useState } from "react";
import { DEFAULT_STATUS_FILTER } from "../constants/matchesConstants";
import { getFilteredMatches } from "../utils/matchesUtils";

export const useMatchesFilters = (matches) => {
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const filteredMatches = getFilteredMatches(matches, statusFilter);

  return {
    statusFilter,
    setStatusFilter,
    filteredMatches,
  };
};
