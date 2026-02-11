export const mapRequestToForm = (request) => ({
  type: request.type || "LAND",
  usage: request.usage || "RESIDENTIAL",
  city: request.city || "",
  district: request.district || "",
  areaFrom: request.areaFrom ?? "",
  areaTo: request.areaTo ?? "",
  budgetFrom: request.budgetFrom ?? "",
  budgetTo: request.budgetTo ?? "",
  purpose: request.purpose || "",
  priority: request.priority || "MEDIUM",
});

export const mapRequestFormToPayload = (formData) => ({
  ...formData,
  areaFrom: formData.areaFrom ? Number(formData.areaFrom) : null,
  areaTo: formData.areaTo ? Number(formData.areaTo) : null,
  budgetFrom: formData.budgetFrom ? Number(formData.budgetFrom) : null,
  budgetTo: formData.budgetTo ? Number(formData.budgetTo) : null,
});
