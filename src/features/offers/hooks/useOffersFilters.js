import { useState } from "react";

const INITIAL_FILTERS = {
  usage: "",
  city: "",
  district: "",
  createdBy: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  contractType: "",
  purpose: "",
};

export const useOffersFilters = () => {
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
    if (filters.createdBy) params.brokerId = filters.createdBy;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minArea) params.minArea = filters.minArea;
    if (filters.maxArea) params.maxArea = filters.maxArea;
    if (filters.contractType) params.contractType = filters.contractType;
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
