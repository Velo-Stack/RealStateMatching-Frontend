export const CONFIDENCE_LABELS = {
  LOW: { label: "منخفض", color: "rose" },
  MEDIUM: { label: "متوسط", color: "amber" },
  HIGH: { label: "مرتفع", color: "emerald" },
};

export const SOURCE_LABELS = {
  MANUAL: "إدخال يدوي",
  CLOSED_OFFER: "عرض مغلق",
  CLOSED_MATCH: "صفقة مغلقة",
  EXTERNAL_API: "مصدر خارجي",
};

export const EMPTY_COMPARABLE = {
  cityId: "",
  neighborhoodId: "",
  areaM2: "",
  salePrice: "",
  saleDate: new Date().toISOString().slice(0, 10),
  latitude: "",
  longitude: "",
  notes: "",
  isVerified: true,
};
