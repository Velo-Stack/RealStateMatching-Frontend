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

const toTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const getActivityStats = (items = []) => {
  const times = items
    .map((item) => toTimestamp(item?.createdAt))
    .filter((time) => time !== null)
    .sort((a, b) => b - a);

  if (times.length === 0) {
    return { lastMs: null, avgGapMs: null };
  }

  const now = Date.now();
  const lastMs = Math.max(0, now - times[0]);

  if (times.length < 2) {
    return { lastMs, avgGapMs: null };
  }

  let totalGap = 0;
  for (let i = 0; i < times.length - 1; i += 1) {
    totalGap += Math.max(0, times[i] - times[i + 1]);
  }

  const avgGapMs = Math.round(totalGap / (times.length - 1));
  return { lastMs, avgGapMs };
};

export const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return "غير متاح";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "أقل من دقيقة";
  if (minutes === 1) return "دقيقة";
  if (minutes === 2) return "دقيقتين";
  if (minutes <= 10) return `${minutes} دقائق`;
  if (minutes < 60) return `${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "ساعة";
  if (hours === 2) return "ساعتين";
  if (hours <= 10) return `${hours} ساعات`;
  if (hours < 24) return `${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "يوم";
  if (days === 2) return "يومين";
  if (days <= 10) return `${days} أيام`;
  return `${days} يوم`;
};

export const getRelativeTimeText = (value) => {
  const time = toTimestamp(value);
  if (time === null) return "غير متاح";
  return `منذ ${formatDuration(Math.max(0, Date.now() - time))}`;
};

export const getGapTimeText = (current, previous) => {
  const currentTime = toTimestamp(current);
  const previousTime = toTimestamp(previous);
  if (currentTime === null || previousTime === null) return "غير متاح";
  return formatDuration(Math.abs(currentTime - previousTime));
};
