export const mapRequestToForm = (request) => ({
  type: request.type || "LAND",
  usage: request.usage || "",
  propertySubType: request.propertySubType || "",
  submittedBy: request.submittedBy || "",
  description: request.description || "",
  city: request.city || "",
  district: request.district || "",
  cityId: request.cityId ?? "",
  neighborhoodId: request.neighborhoodId ?? "",
  areaFrom: request.areaFrom ?? "",
  areaTo: request.areaTo ?? "",
  budgetFrom: request.budgetFrom ?? "",
  budgetTo: request.budgetTo ?? "",
  purpose: request.purpose || "",
  priority: request.priority || "MEDIUM",
  brokerContactPhone: request.brokerContactPhone || "",
});

export const mapRequestFormToPayload = (formData) => ({
  ...formData,
  cityId: formData.cityId ? Number(formData.cityId) : null,
  neighborhoodId: formData.neighborhoodId ? Number(formData.neighborhoodId) : null,
  areaFrom: formData.areaFrom ? Number(formData.areaFrom) : null,
  areaTo: formData.areaTo ? Number(formData.areaTo) : null,
  budgetFrom: formData.budgetFrom ? Number(formData.budgetFrom) : null,
  budgetTo: formData.budgetTo ? Number(formData.budgetTo) : null,
});

const toTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const getActivityStats = (items = []) => {
  const times = items
    .map((item) => toTimestamp(item?.createdAt))
    .filter((time) => time !== null)
    .sort((a, b) => b - a);

  if (times.length === 0) {
    return { lastMs: null, avgGapMs: null };
  }

  const now = Date.now();
  const lastMs = Math.max(0, now - times[0]);

  if (times.length < 2) {
    return { lastMs, avgGapMs: null };
  }

  let totalGap = 0;
  for (let i = 0; i < times.length - 1; i += 1) {
    totalGap += Math.max(0, times[i] - times[i + 1]);
  }

  const avgGapMs = Math.round(totalGap / (times.length - 1));
  return { lastMs, avgGapMs };
};

export const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return "غير متاح";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "أقل من دقيقة";
  if (minutes === 1) return "دقيقة";
  if (minutes === 2) return "دقيقتين";
  if (minutes <= 10) return `${minutes} دقائق`;
  if (minutes < 60) return `${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "ساعة";
  if (hours === 2) return "ساعتين";
  if (hours <= 10) return `${hours} ساعات`;
  if (hours < 24) return `${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "يوم";
  if (days === 2) return "يومين";
  if (days <= 10) return `${days} أيام`;
  return `${days} يوم`;
};

export const getRelativeTimeText = (value) => {
  const time = toTimestamp(value);
  if (time === null) return "غير متاح";
  return `منذ ${formatDuration(Math.max(0, Date.now() - time))}`;
};

export const getGapTimeText = (current, previous) => {
  const currentTime = toTimestamp(current);
  const previousTime = toTimestamp(previous);
  if (currentTime === null || previousTime === null) return "غير متاح";
  return formatDuration(Math.abs(currentTime - previousTime));
};
