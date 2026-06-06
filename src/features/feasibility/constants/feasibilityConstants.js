export const RISK_SEVERITY_STYLES = {
  HIGH: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  LOW: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export const EMPTY_FEASIBILITY_FORM = {
  landArea: "",
  landPrice: "",
  investorCount: 1,
  investmentPerInvestor: "",
  expectedSalePrice: "",
  holdingMonths: 12,
  developmentCost: "",
};

export const buildPrefillFromOffer = (offer) => {
  const area = offer?.areaTo || offer?.areaFrom || "";
  const price = offer?.priceTo || offer?.priceFrom || "";
  return {
    ...EMPTY_FEASIBILITY_FORM,
    landArea: area ? String(area) : "",
    landPrice: price ? String(Number(price)) : "",
  };
};

export const buildEvaluatePayloadFromOffer = (offer) => ({
  offerId: offer?.id,
  areaM2: offer?.areaTo || offer?.areaFrom,
  latitude: offer?.latitude ?? undefined,
  longitude: offer?.longitude ?? undefined,
  cityId: offer?.cityId ?? undefined,
  neighborhoodId: offer?.neighborhoodId ?? undefined,
});
