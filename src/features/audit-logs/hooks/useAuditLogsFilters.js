import { useState } from "react";
import { initialFilters } from "../constants/auditLogsDefaults";

export const useAuditLogsFilters = () => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ ...initialFilters });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return {
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
  };
};
