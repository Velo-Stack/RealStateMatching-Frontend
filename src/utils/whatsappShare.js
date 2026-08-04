import {
  USAGE_TYPES,
  PROPERTY_TYPES,
  PURPOSE_TYPES,
  OFFER_PURPOSE_OPTIONS,
  getLabelByValue,
  getLabelFromArray,
  getPropertySubTypeLabel,
} from "../constants/enums";
import { getOfferCode, getRequestCode } from "./entityCodes";
import { buildMapsLink } from "../constants/maps";

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatRange = (fromValue, toValue, suffix = "") => {
  const fromParsed = Number(fromValue);
  const toParsed = Number(toValue);

  const hasFrom = Number.isFinite(fromParsed) && fromParsed > 0;
  const hasTo = Number.isFinite(toParsed) && toParsed > 0;

  if (!hasFrom && !hasTo) return null;

  const fromStr = hasFrom ? fromParsed.toLocaleString("ar-EG") : null;
  const toStr = hasTo ? toParsed.toLocaleString("ar-EG") : null;

  if (fromStr && toStr) {
    if (fromStr === toStr) return `${fromStr}${suffix}`;
    return `${fromStr} - ${toStr}${suffix}`;
  }
  if (fromStr) return `${fromStr}${suffix}`;
  return `${toStr}${suffix}`;
};

const formatLocationLink = (entity) => {
  if (entity.latitude != null && entity.longitude != null) {
    return buildMapsLink(entity.latitude, entity.longitude);
  }
  if (hasValue(entity.mapAddress)) {
    return String(entity.mapAddress).trim();
  }
  if (hasValue(entity.coordinates)) {
    return String(entity.coordinates).trim();
  }
  return null;
};

const buildNumberedList = (candidates) => {
  let counter = 1;
  const lines = [];

  for (const item of candidates) {
    if (hasValue(item.value)) {
      lines.push(`${counter}- *${item.label}:* ${String(item.value).trim()}`);
      counter++;
    }
  }

  return lines.join("\n");
};

export const buildWhatsAppShareUrl = (text) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const buildOfferWhatsAppShareText = (offer) => {
  if (!offer) return "";

  const code = getOfferCode(offer);
  const city = offer.cityRel?.name || offer.city;
  const district = offer.neighborhoodRel?.name || offer.district;
  const usage = getLabelByValue(USAGE_TYPES, offer.usage);
  const subType =
    getPropertySubTypeLabel(offer.usage, offer.propertySubType) ||
    getLabelByValue(PROPERTY_TYPES, offer.type);
  const purpose =
    getLabelFromArray(OFFER_PURPOSE_OPTIONS, offer.purpose) ||
    getLabelByValue(PURPOSE_TYPES, offer.purpose);
  const area = formatRange(offer.areaFrom, offer.areaTo, " م²");
  const price = formatRange(offer.priceFrom, offer.priceTo, " ر.س");
  const location = formatLocationLink(offer);

  const candidates = [
    { label: "استخدام العقار", value: usage },
    { label: "نوعه", value: subType },
    { label: "الغرض", value: purpose },
    { label: "المدينة", value: city },
    { label: "الحي", value: district },
    { label: "المساحة", value: area },
    { label: "الاطوال", value: offer.lengths },
    { label: "الواجهات", value: offer.facades },
    { label: "السعر", value: price },
    { label: "الموقع", value: location },
  ];

  const body = buildNumberedList(candidates);
  const contactPhone = offer.brokerContactPhone || offer.createdBy?.phone;
  const contactFooter = contactPhone ? `\n\n📲 *للتواصل:* ${contactPhone}` : "";

  return `🏡 *عرض عقاري - رواسخ*\n🔹 *الكود:* ${code}\n\n${body}${contactFooter}`;
};

export const buildRequestWhatsAppShareText = (request) => {
  if (!request) return "";

  const code = getRequestCode(request);
  const city = request.cityRel?.name || request.city;
  const district =
    Array.isArray(request.neighborhoods) && request.neighborhoods.length > 0
      ? request.neighborhoods.map((item) => item.name).filter(Boolean).join("، ")
      : request.neighborhoodRel?.name || request.district;
  const usage = getLabelByValue(USAGE_TYPES, request.usage);
  const subType =
    getPropertySubTypeLabel(request.usage, request.propertySubType) ||
    getLabelByValue(PROPERTY_TYPES, request.type);
  const purpose = getLabelByValue(PURPOSE_TYPES, request.purpose);
  const area = formatRange(request.areaFrom, request.areaTo, " م²");
  const price = formatRange(request.budgetFrom, request.budgetTo, " ر.س");
  const location = formatLocationLink(request);

  const candidates = [
    { label: "استخدام العقار", value: usage },
    { label: "نوعه", value: subType },
    { label: "الغرض", value: purpose },
    { label: "المدينة", value: city },
    { label: "الحي", value: district },
    { label: "المساحة", value: area },
    { label: "الاطوال", value: request.lengths },
    { label: "الواجهات", value: request.facades },
    { label: "السعر", value: price },
    { label: "الموقع", value: location },
  ];

  const body = buildNumberedList(candidates);
  const contactPhone = request.brokerContactPhone || request.createdBy?.phone;
  const contactFooter = contactPhone ? `\n\n📲 *للتواصل:* ${contactPhone}` : "";

  return `📋 *طلب عقاري - رواسخ*\n🔹 *الكود:* ${code}\n\n${body}${contactFooter}`;
};

export const getOfferWhatsAppShareUrl = (offer) =>
  buildWhatsAppShareUrl(buildOfferWhatsAppShareText(offer));

export const getRequestWhatsAppShareUrl = (request) =>
  buildWhatsAppShareUrl(buildRequestWhatsAppShareText(request));
