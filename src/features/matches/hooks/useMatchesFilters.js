import { useState } from "react";
import { DEFAULT_STATUS_FILTER, DEFAULT_SCORE_FILTER } from "../constants/matchesConstants";

export const useMatchesFilters = () => {
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [minScoreFilter, setMinScoreFilter] = useState(DEFAULT_SCORE_FILTER);

  return {
    statusFilter,
    setStatusFilter,
    minScoreFilter,
    setMinScoreFilter,
  };
};
