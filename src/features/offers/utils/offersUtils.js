import {
  formatDuration,
  getActivityStats,
  getGapTimeText,
  getRelativeTimeText,
} from "../../../shared/lib/activityTime";

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
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) return null;
  return numericValue;
};

const normalizeSubmittedBy = (value) => {
  if (isNullishOrEmpty(value)) return null;
  return SUBMITTED_BY_VALUES.has(value) ? value : null;
};

const getSingleAreaValueFromOffer = (offer) => {
  if (!isNullishOrEmpty(offer.areaFrom)) return offer.areaFrom;
  if (!isNullishOrEmpty(offer.areaTo)) return offer.areaTo;
  return "";
};

export const mapOfferToForm = (offer) => ({
  type: offer.type || "LAND",
  usage: offer.usage || "",
  propertySubType: offer.propertySubType || "",
  exclusivity: offer.exclusivity || "",
  submittedBy: offer.submittedBy || "",
  city: offer.city || "",
  district: offer.district || "",
  cityId: offer.cityId ?? "",
  neighborhoodId: offer.neighborhoodId ?? "",
  area: getSingleAreaValueFromOffer(offer),
  areaFrom: offer.areaFrom ?? "",
  areaTo: offer.areaTo ?? "",
  boundaries: offer.boundaries || "",
  lengths: offer.lengths || "",
  facades: offer.facades || "",
  price: offer.priceFrom ?? offer.priceTo ?? "",
  purpose: offer.purpose || "",
  contractType: offer.contractType || "",
  brokersCount: offer.brokersCount ?? "",
  description: offer.description || "",
  brokerContactPhone: offer.brokerContactPhone || "",
  coordinates: offer.coordinates || "",
});

export const mapOfferFormToPayload = (formData) => {
  const { price, area, ...rest } = formData;
  const usesSingleArea = Object.prototype.hasOwnProperty.call(formData, "area");
  const singleArea = usesSingleArea ? toNonNegativeNumberOrNull(area) : null;

  return {
    ...rest,
    submittedBy: normalizeSubmittedBy(formData.submittedBy),
    priceFrom: toNonNegativeNumberOrNull(price),
    priceTo: toNonNegativeNumberOrNull(price),
    cityId: toNonNegativeNumberOrNull(formData.cityId),
    neighborhoodId: toNonNegativeNumberOrNull(formData.neighborhoodId),
    areaFrom: usesSingleArea
      ? singleArea
      : toNonNegativeNumberOrNull(formData.areaFrom),
    areaTo: usesSingleArea
      ? singleArea
      : toNonNegativeNumberOrNull(formData.areaTo),
    brokersCount: toNonNegativeNumberOrNull(formData.brokersCount),
    boundaries: formData.boundaries || null,
    lengths: formData.lengths || null,
    facades: formData.facades || null,
  };
};
