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
