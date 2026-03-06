import api from "../../../utils/api";

export const fetchTeams = async () => {
  const { data } = await api.get("/teams");
  return data;
};

export const fetchTeamById = async (teamId) => {
  const { data } = await api.get(`/teams/${teamId}`);
  return data;
};

export const fetchTeamMembers = async (teamId) => {
  const { data } = await api.get(`/teams/${teamId}/members`);
  return data;
};

export const fetchTeamUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createTeam = async (payload) => {
  const { data } = await api.post("/teams", payload);
  return data;
};

export const addTeamMember = async ({ teamId, payload }) => {
  const { data } = await api.post(`/teams/${teamId}/members`, payload);
  return data;
};

export const removeTeamMember = async ({ teamId, memberId }) => {
  const { data } = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return data;
};

export const updateTeamMemberRole = async ({ teamId, memberId, role }) => {
  const { data } = await api.patch(`/teams/${teamId}/members/${memberId}`, { role });
  return data;
};

export const deleteTeam = async (teamId) => {
  const { data } = await api.delete(`/teams/${teamId}`);
  return data;
};
