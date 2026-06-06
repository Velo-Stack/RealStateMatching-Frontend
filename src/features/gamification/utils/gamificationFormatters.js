export const TIER_LABELS = {
  REGULAR: "وسيط عادي",
  SKILLED: "وسيط متمكن",
  ELITE: "وسيط النخبة",
};

export const TIER_ICONS = {
  REGULAR: "🥉",
  SKILLED: "🥈",
  ELITE: "🥇",
};

export const REASON_LABELS = {
  MATCH_CLOSED: "صفقة مغلقة",
  MEDIATION_CONTRACT: "عقد وساطة",
  OFFER_CREATED: "إضافة عرض",
  REQUEST_CREATED: "إضافة طلب",
  MANUAL: "تعديل يدوي",
  REWARD_REDEEM: "استبدال مكافأة",
  REWARD_REFUND: "استرداد نقاط",
};

export const formatPoints = (value) =>
  new Intl.NumberFormat("ar-SA").format(Number(value) || 0);

export const getProgressPercent = (current, target) => {
  if (!target || target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
};
