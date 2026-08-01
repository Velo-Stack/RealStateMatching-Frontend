import {
  USAGE_TYPES,
  getLabelByValue,
  getPropertySubTypeLabel,
} from "../constants/enums";
import { getOfferCode, getRequestCode } from "./entityCodes";

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed.toLocaleString("ar-EG");
};

const formatRange = (fromValue, toValue, suffix = "") => {
  const from = formatNumber(fromValue);
  const to = formatNumber(toValue);

  if (!from && !to) return null;
  if (!from) return `${to}${suffix}`;
  if (!to || from === to) return `${from}${suffix}`;
  return `${from} - ${to}${suffix}`;
};

const formatLocation = (entity) => {
  const city = entity.cityRel?.name || entity.city;
  const district =
    Array.isArray(entity.neighborhoods) && entity.neighborhoods.length > 0
      ? entity.neighborhoods.map((item) => item.name).filter(Boolean).join("، ")
      : entity.neighborhoodRel?.name || entity.district;

  const parts = [city, district].filter(hasValue);
  return parts.length ? parts.join(" - ") : null;
};

const formatUsage = (entity) =>
  getPropertySubTypeLabel(entity.usage, entity.propertySubType) ||
  getLabelByValue(USAGE_TYPES, entity.usage) ||
  null;

const buildShareLines = (lines) =>
  lines
    .filter((line) => hasValue(line.value))
    .map((line) => `${line.label}: ${String(line.value).trim()}`)
    .join("\n");

export const buildWhatsAppShareUrl = (text) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

export const buildOfferWhatsAppShareText = (offer) => {
  if (!offer) return "";

  const body = buildShareLines([
    { label: "كود العرض", value: getOfferCode(offer) },
    { label: "نوع الاستخدام", value: formatUsage(offer) },
    {
      label: "السعر",
      value: formatRange(offer.priceFrom, offer.priceTo, " ر.س"),
    },
    {
      label: "المساحة",
      value: formatRange(offer.areaFrom, offer.areaTo, " م²"),
    },
    { label: "الموقع", value: formatLocation(offer) },
    { label: "الواجهات", value: offer.facades },
    { label: "الأطوال", value: offer.lengths },
  ]);

  return `عرض عقاري من رواسخ\n\n${body}`;
};

export const buildRequestWhatsAppShareText = (request) => {
  if (!request) return "";

  const body = buildShareLines([
    { label: "كود الطلب", value: getRequestCode(request) },
    { label: "نوع الاستخدام", value: formatUsage(request) },
    {
      label: "الميزانية",
      value: formatRange(request.budgetFrom, request.budgetTo, " ر.س"),
    },
    {
      label: "المساحة",
      value: formatRange(request.areaFrom, request.areaTo, " م²"),
    },
    { label: "الموقع", value: formatLocation(request) },
  ]);

  return `طلب عقاري من رواسخ\n\n${body}`;
};

export const getOfferWhatsAppShareUrl = (offer) =>
  buildWhatsAppShareUrl(buildOfferWhatsAppShareText(offer));

export const getRequestWhatsAppShareUrl = (request) =>
  buildWhatsAppShareUrl(buildRequestWhatsAppShareText(request));
