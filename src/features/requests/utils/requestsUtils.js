import {
  formatDuration,
  getActivityStats,
  getGapTimeText,
  getRelativeTimeText,
} from "../../../shared/lib/activityTime";
import { removeCommas } from "../../../utils/numberFormatting";

export { formatDuration, getActivityStats, getGapTimeText, getRelativeTimeText };

const SUBMITTED_BY_VALUES = new Set([
  "OWNER",
  "AGENT",
  "DIRECT_BROKER",
  "BROKER",
  "BUYER",
]);

const isNullishOrEmpty = (value) =>
  value === null || value === undefined || value === "";

const toNonNegativeNumberOrNull = (value) => {
  if (isNullishOrEmpty(value)) return null;
  // Remove commas before converting to number
  const cleanValue = removeCommas(String(value));
  const numericValue = Number(cleanValue);
  if (!Number.isFinite(numericValue) || numericValue < 0) return null;
  return numericValue;
};

const normalizeSubmittedBy = (value) => {
  if (isNullishOrEmpty(value)) return null;
  return SUBMITTED_BY_VALUES.has(value) ? value : null;
};

const getSingleAreaValueFromRequest = (request) => {
  if (!isNullishOrEmpty(request.areaFrom)) return request.areaFrom;
  if (!isNullishOrEmpty(request.areaTo)) return request.areaTo;
  return "";
};

export const mapRequestToForm = (request) => ({
  type: request.type || "LAND",
  usage: request.usage || "",
  propertySubType: request.propertySubType || "",
  submittedBy: request.submittedBy || "",
  description: request.description || "",
  city: request.city || "",
  district: request.district || "",
  cityId: request.cityId ?? "",
  neighborhoodId: request.neighborhoodId ?? "",
  neighborhoodIds: request.neighborhoodIds || [],
  area: getSingleAreaValueFromRequest(request),
  areaFrom: request.areaFrom ?? "",
  areaTo: request.areaTo ?? "",
  budgetFrom: request.budgetFrom ?? "",
  budgetTo: request.budgetTo ?? "",
  purpose: request.purpose || "",
  priority: request.priority || "MEDIUM",
  brokerContactPhone: request.brokerContactPhone || "",
});

export const mapRequestFormToPayload = (formData) => {
  const { area, ...rest } = formData;
  const usesSingleArea = Object.prototype.hasOwnProperty.call(formData, "area");
  const singleArea = usesSingleArea ? toNonNegativeNumberOrNull(area) : null;

  // Use neighborhoodIds if available, otherwise fall back to single neighborhoodId
  const neighborhoodIds = formData.neighborhoodIds && formData.neighborhoodIds.length > 0
    ? formData.neighborhoodIds
    : formData.neighborhoodId
      ? [toNonNegativeNumberOrNull(formData.neighborhoodId)]
      : [];

  return {
    ...rest,
    submittedBy: normalizeSubmittedBy(formData.submittedBy),
    cityId: toNonNegativeNumberOrNull(formData.cityId),
    neighborhoodIds: neighborhoodIds.filter(id => id !== null),
    areaFrom: usesSingleArea
      ? singleArea
      : toNonNegativeNumberOrNull(formData.areaFrom),
    areaTo: usesSingleArea
      ? singleArea
      : toNonNegativeNumberOrNull(formData.areaTo),
    budgetFrom: toNonNegativeNumberOrNull(formData.budgetFrom),
    budgetTo: toNonNegativeNumberOrNull(formData.budgetTo),
  };
};
