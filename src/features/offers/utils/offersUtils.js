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

const PROPERTY_SUBTYPES_WITHOUT_LENGTHS = new Set([
  "APARTMENT",
  "FLOOR",
  "TOWNHOUSE",
]);

export const shouldShowOfferLengths = (propertySubType) =>
  !PROPERTY_SUBTYPES_WITHOUT_LENGTHS.has(propertySubType);

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
  latitude: offer.latitude ?? "",
  longitude: offer.longitude ?? "",
  mapAddress: offer.mapAddress || "",
});

export const mapOfferFormToPayload = (formData) => {
  const { price, area, latitude, longitude, mapAddress, ...rest } = formData;
  const usesSingleArea = Object.prototype.hasOwnProperty.call(formData, "area");
  const singleArea = usesSingleArea ? toNonNegativeNumberOrNull(area) : null;

  const hasGeo =
    latitude !== "" &&
    latitude != null &&
    longitude !== "" &&
    longitude != null &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const payload = {
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
    lengths: shouldShowOfferLengths(formData.propertySubType)
      ? formData.lengths || null
      : null,
    facades: formData.facades || null,
  };

  if (hasGeo) {
    payload.latitude = Number(latitude);
    payload.longitude = Number(longitude);
    payload.mapAddress = mapAddress || null;
  }

  return payload;
};
