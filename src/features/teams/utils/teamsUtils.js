import { TEAM_MEMBER_FORM_INITIAL_STATE, TEAM_FORM_INITIAL_STATE } from "../constants/teamsConstants";

export const resetTeamForm = () => ({ ...TEAM_FORM_INITIAL_STATE });

export const resetTeamMemberForm = () => ({ ...TEAM_MEMBER_FORM_INITIAL_STATE });

export const getAvailableUsersForTeam = (users, selectedTeam) =>
  users.filter((user) => !selectedTeam?.members?.some((member) => member.user?.id === user.id));

export const getUserSystemRoleLabel = (role) => {
  if (role === "ADMIN") return "مسؤول";
  if (role === "MANAGER") return "مدير";
  return "وسيط";
};

export const getUserSystemRoleClasses = (role) => {
  if (role === "ADMIN") return "bg-red-500/10 text-red-400";
  if (role === "MANAGER") return "bg-violet-500/10 text-violet-400";
  return "bg-slate-500/10 text-slate-400";
};
