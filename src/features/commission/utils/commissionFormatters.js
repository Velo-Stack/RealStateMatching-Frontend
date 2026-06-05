export const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `${num.toLocaleString("ar-EG", { maximumFractionDigits: 2 })} ر.س`;
};

export const averageOfferPrice = (offer) => {
  if (!offer) return "";
  const from = Number(offer.priceFrom);
  const to = Number(offer.priceTo ?? offer.priceFrom);
  if (!Number.isFinite(from) && !Number.isFinite(to)) return "";
  if (!Number.isFinite(from)) return to;
  if (!Number.isFinite(to)) return from;
  return Math.round(((from + to) / 2) * 100) / 100;
};

export const buildPrefillFromOffer = (offer) => ({
  salePrice: averageOfferPrice(offer) || "",
  contractType: offer?.contractType || "WITH_MEDIATION_CONTRACT",
  exclusivity: offer?.exclusivity || "NON_EXCLUSIVE",
  brokerCount: offer?.brokersCount || 1,
});
