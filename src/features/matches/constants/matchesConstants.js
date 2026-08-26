export const MATCHES_QUERY_KEY = ["matches"];
export const MATCHES_PAGE_SIZE = 10;

export const DEFAULT_STATUS_FILTER = "ALL";
export const DEFAULT_SCORE_FILTER = "ALL";

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "جميع الحالات" },
  { value: "NEW", label: "جديد" },
  { value: "CONTACTED", label: "تم التواصل" },
  { value: "NEGOTIATION", label: "تفاوض" },
  { value: "CLOSED", label: "تم الإغلاق" },
  { value: "REJECTED", label: "مرفوض" },
];

export const SCORE_FILTER_OPTIONS = [
  { value: "ALL", label: "جميع النسب (الكل)" },
  { value: "10",  label: "أكثر من 10%" },
  { value: "25",  label: "أكثر من 25%" },
  { value: "50",  label: "أكثر من 50%" },
  { value: "75",  label: "أكثر من 75%" },
  { value: "85",  label: "أكثر من 85%" },
  { value: "90",  label: "أكثر من 90%" },
  { value: "95",  label: "أكثر من 95%" },
];

export const STATUS_UPDATE_OPTIONS = [
  { value: "NEW", label: "جديد" },
  { value: "CONTACTED", label: "تم التواصل" },
  { value: "NEGOTIATION", label: "تفاوض" },
  { value: "CLOSED", label: "إغلاق صفقة" },
  { value: "REJECTED", label: "رفض" },
];
