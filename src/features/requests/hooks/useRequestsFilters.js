import { useState } from "react";

const INITIAL_FILTERS = {
  usage: "",
  city: "",
  district: "",
  createdBy: "",
  minBudget: "",
  maxBudget: "",
  minArea: "",
  maxArea: "",
  priority: "",
  purpose: "",
};

export const useRequestsFilters = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getFilterParams = () => {
    const params = {};
    if (filters.usage) params.usage = filters.usage;
    if (filters.city) params.city = filters.city;
    if (filters.district) params.district = filters.district;
    if (filters.createdBy) params.createdById = filters.createdBy;
    if (filters.minBudget) params.minBudget = filters.minBudget;
    if (filters.maxBudget) params.maxBudget = filters.maxBudget;
    if (filters.minArea) params.minArea = filters.minArea;
    if (filters.maxArea) params.maxArea = filters.maxArea;
    if (filters.priority) params.priority = filters.priority;
    if (filters.purpose) params.purpose = filters.purpose;
    return params;
  };

  return {
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    getFilterParams,
  };
};
