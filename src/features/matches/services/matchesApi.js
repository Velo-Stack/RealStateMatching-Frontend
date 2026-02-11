import api from "../../../utils/api";

export const fetchMatches = async () => {
  const { data } = await api.get("/matches");
  return data;
};

export const patchMatchStatus = async ({ id, status }) => {
  const { data } = await api.patch(`/matches/${id}`, { status });
  return data;
};
