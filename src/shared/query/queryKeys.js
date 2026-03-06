export const USERS_QUERY_KEYS = {
  list: ["users", "list"],
  detail: (userId) => ["users", "detail", userId],
};

export const TEAMS_QUERY_KEYS = {
  list: ["teams", "list"],
  users: ["teams", "users"],
  myTeam: ["teams", "my-team"],
  detail: (teamId) => ["teams", "detail", teamId],
  members: (teamId) => ["teams", "members", teamId],
};

export const CHAT_QUERY_KEYS = {
  conversations: ["chat", "conversations"],
  users: ["chat", "users"],
  messages: (conversationId) => ["chat", "messages", conversationId],
};

export const NOTIFICATIONS_QUERY_KEYS = {
  list: ["notifications", "list"],
};

export const AUDIT_LOGS_QUERY_KEYS = {
  list: (filters) => ["audit-logs", "list", filters],
  users: ["audit-logs", "users"],
};

export const DASHBOARD_QUERY_KEYS = {
  summary: ["dashboard", "summary"],
  topAreas: ["dashboard", "top-areas"],
  topBrokers: ["dashboard", "top-brokers"],
  activityGaps: ["dashboard", "activity-gaps"],
};

export const META_QUERY_KEYS = {
  enums: ["meta", "enums"],
  cities: ["meta", "cities"],
  neighborhoods: (cityId) => ["meta", "neighborhoods", cityId],
};
