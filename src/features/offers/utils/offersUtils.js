export const mapOfferToForm = (offer) => ({
  type: offer.type || "LAND",
  usage: offer.usage || "RESIDENTIAL",
  city: offer.city || "",
  district: offer.district || "",
  areaFrom: offer.areaFrom ?? "",
  areaTo: offer.areaTo ?? "",
  priceFrom: offer.priceFrom ?? "",
  priceTo: offer.priceTo ?? "",
  purpose: offer.purpose || "",
  contractType: offer.contractType || "",
  brokersCount: offer.brokersCount ?? "",
  description: offer.description || "",
  coordinates: offer.coordinates || "",
});

export const mapOfferFormToPayload = (formData) => ({
  ...formData,
  areaFrom: formData.areaFrom ? Number(formData.areaFrom) : null,
  areaTo: formData.areaTo ? Number(formData.areaTo) : null,
  priceFrom: formData.priceFrom ? Number(formData.priceFrom) : null,
  priceTo: formData.priceTo ? Number(formData.priceTo) : null,
  brokersCount: formData.brokersCount ? Number(formData.brokersCount) : null,
});
