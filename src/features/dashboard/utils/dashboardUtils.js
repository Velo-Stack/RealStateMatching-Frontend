import { TEAM_TYPE_OPTIONS } from "../../../constants/enums";

export const getTeamTypeLabel = (type) => {
  const found = TEAM_TYPE_OPTIONS.find((teamType) => teamType.value === type);
  return found?.label || type;
};

export const mapTopAreasToChartData = (topAreas) =>
  topAreas.map((area) => ({
    city: area.city,
    count: area._count?.id ?? 0,
  }));

export const getTrendDirection = (current = 0, previous = 0) => {
  if (current === previous) return "flat";
  return current > previous ? "up" : "down";
};

export const getTopListTrend = (items = [], valueSelector = (item) => item?.count ?? 0) => {
  if (!Array.isArray(items) || items.length < 2) {
    return { direction: "flat", delta: 0 };
  }

  const current = Number(valueSelector(items[0])) || 0;
  const previous = Number(valueSelector(items[1])) || 0;

  return {
    direction: getTrendDirection(current, previous),
    delta: Math.abs(current - previous),
  };
};

const toTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
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

export const getCreatorName = (item) =>
  item?.createdBy?.name ||
  item?.createdByName ||
  item?.user?.name ||
  item?.broker?.name ||
  null;

export const getLatestItemInfo = (items = []) => {
  let latestItem = null;
  let latestTime = null;

  items.forEach((item) => {
    const time = toTimestamp(item?.createdAt);
    if (time === null) return;
    if (latestTime === null || time > latestTime) {
      latestTime = time;
      latestItem = item;
    }
  });

  return {
    item: latestItem,
    timeMs: latestTime === null ? null : Math.max(0, Date.now() - latestTime),
  };
};

const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLocalDateLabel = (date) =>
  date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });

export const buildActivitySeries = (offers = [], requests = []) => {
  const map = new Map();

  offers.forEach((offer) => {
    const time = toTimestamp(offer?.createdAt);
    if (time === null) return;
    const date = new Date(time);
    const key = getLocalDateKey(date);
    const current = map.get(key) || { dateKey: key, label: getLocalDateLabel(date), offers: 0, requests: 0 };
    current.offers += 1;
    map.set(key, current);
  });

  requests.forEach((request) => {
    const time = toTimestamp(request?.createdAt);
    if (time === null) return;
    const date = new Date(time);
    const key = getLocalDateKey(date);
    const current = map.get(key) || { dateKey: key, label: getLocalDateLabel(date), offers: 0, requests: 0 };
    current.requests += 1;
    map.set(key, current);
  });

  return Array.from(map.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
};

export const getPeakDay = (series = [], key = "offers") => {
  if (!Array.isArray(series) || series.length === 0) {
    return { label: "غير متاح", count: 0 };
  }

  let peak = series[0];
  series.forEach((item) => {
    if ((item[key] || 0) > (peak[key] || 0)) peak = item;
  });

  const count = peak[key] || 0;
  const label = count > 0 ? peak.label : "غير متاح";
  return { label, count };
};
