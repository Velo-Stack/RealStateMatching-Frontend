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
