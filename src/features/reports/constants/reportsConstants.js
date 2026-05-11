import { Buildings, GitMerge, Target } from "phosphor-react";

export const REPORT_FIELD_OPTIONS = {
  offers: [
    { value: "code", label: "كود العرض" },
    { value: "propertySubType", label: "النوع التفصيلي" },
    { value: "type", label: "نوع العقار" },
    { value: "usage", label: "الاستخدام" },
    { value: "city", label: "المدينة" },
    { value: "district", label: "الحي" },
    { value: "area", label: "المساحة" },
    { value: "price", label: "السعر" },
    { value: "purpose", label: "الغرض" },
    { value: "landStatus", label: "حالة الأرض" },
    { value: "exclusivity", label: "الحصرية" },
    { value: "contractType", label: "طبيعة التعاقد" },
    { value: "submittedBy", label: "مقدم العرض" },
    { value: "brokerContactName", label: "اسم التواصل" },
    { value: "brokerContactPhone", label: "رقم التواصل" },
    { value: "createdBy", label: "مدخل العرض" },
    { value: "team", label: "الفريق" },
    { value: "description", label: "الوصف" },
    { value: "coordinates", label: "رابط الموقع" },
    { value: "createdAt", label: "تاريخ الإنشاء" },
  ],
  requests: [
    { value: "code", label: "كود الطلب" },
    { value: "propertySubType", label: "النوع التفصيلي" },
    { value: "type", label: "نوع العقار" },
    { value: "usage", label: "الاستخدام" },
    { value: "city", label: "المدينة" },
    { value: "district", label: "الحي" },
    { value: "area", label: "المساحة المطلوبة" },
    { value: "budget", label: "الميزانية" },
    { value: "purpose", label: "الغرض" },
    { value: "landStatus", label: "حالة الأرض" },
    { value: "priority", label: "الأولوية" },
    { value: "submittedBy", label: "مقدم الطلب" },
    { value: "brokerContactName", label: "اسم التواصل" },
    { value: "brokerContactPhone", label: "رقم التواصل" },
    { value: "createdBy", label: "مدخل الطلب" },
    { value: "team", label: "الفريق" },
    { value: "description", label: "الوصف" },
    { value: "createdAt", label: "تاريخ الإنشاء" },
  ],
  matches: [
    { value: "offerCode", label: "كود العرض" },
    { value: "requestCode", label: "كود الطلب" },
    { value: "score", label: "نسبة التطابق" },
    { value: "status", label: "الحالة" },
    { value: "offerType", label: "نوع العرض" },
    { value: "requestType", label: "نوع الطلب" },
    { value: "offerUsage", label: "استخدام العرض" },
    { value: "requestUsage", label: "استخدام الطلب" },
    { value: "offerLocation", label: "موقع العرض" },
    { value: "requestLocation", label: "موقع الطلب" },
    { value: "offerPrice", label: "سعر العرض" },
    { value: "requestBudget", label: "ميزانية الطلب" },
    { value: "createdAt", label: "تاريخ التطابق" },
  ],
};

export const DEFAULT_REPORT_FIELDS = {
  offers: [
    "code",
    "propertySubType",
    "usage",
    "city",
    "district",
    "area",
    "price",
    "createdBy",
    "createdAt",
  ],
  requests: [
    "code",
    "propertySubType",
    "usage",
    "city",
    "district",
    "area",
    "budget",
    "priority",
    "createdBy",
    "createdAt",
  ],
  matches: [
    "offerCode",
    "requestCode",
    "score",
    "status",
    "offerType",
    "requestType",
    "offerLocation",
    "requestLocation",
    "createdAt",
  ],
};

export const REPORT_TYPES = [
  {
    value: "offers",
    label: "العروض العقارية",
    icon: Buildings,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    value: "requests",
    label: "طلبات العملاء",
    icon: Target,
    color: "from-violet-500 to-violet-600",
  },
  {
    value: "matches",
    label: "التطابقات الذكية",
    icon: GitMerge,
    color: "from-cyan-500 to-cyan-600",
  },
];

export const REPORTS_DEFAULT_TYPE = "offers";

export const REPORTS_DOWNLOAD_RESET_DELAY = 1000;

export const REPORTS_DOWNLOAD_ERROR_MESSAGE =
  "فشل تحميل التقرير، يرجى المحاولة مرة أخرى.";
