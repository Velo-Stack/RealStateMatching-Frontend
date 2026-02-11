export const TEAMS_QUERY_KEY = ["teams"];
export const USERS_QUERY_KEY = ["users"];
export const MY_TEAM_QUERY_KEY = ["myTeam"];

export const TEAM_FORM_INITIAL_STATE = { name: "", type: "LANDS" };
export const TEAM_MEMBER_FORM_INITIAL_STATE = { userId: "", role: "MEMBER" };

export const TEAM_TYPE_COLORS = {
  LANDS: "from-emerald-500 to-cyan-500",
  PROPERTIES: "from-violet-500 to-purple-500",
  MAINTENANCE: "from-amber-500 to-orange-500",
  RENTAL: "from-cyan-500 to-blue-500",
  ASSET_MANAGEMENT: "from-rose-500 to-pink-500",
};

export const TEAM_CREATE_SUCCESS_MESSAGE = "تم إنشاء الفريق بنجاح";
export const TEAM_CREATE_ERROR_MESSAGE = "فشل إنشاء الفريق";

export const TEAM_MEMBER_ADD_SUCCESS_MESSAGE = "تم إضافة العضو بنجاح";
export const TEAM_MEMBER_ADD_ERROR_MESSAGE = "فشل إضافة العضو";

export const TEAM_MEMBER_REMOVE_SUCCESS_MESSAGE = "تم إزالة العضو بنجاح";
export const TEAM_MEMBER_REMOVE_ERROR_MESSAGE = "فشل إزالة العضو";

export const TEAM_MEMBER_ROLE_UPDATE_SUCCESS_MESSAGE = "تم تحديث الدور بنجاح";
export const TEAM_MEMBER_ROLE_UPDATE_ERROR_MESSAGE = "فشل تحديث الدور";
