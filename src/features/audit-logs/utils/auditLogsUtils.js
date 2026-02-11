import { actionLabels, resourceConfig } from "../constants/auditLogsConfig";

export const groupLogsByDate = (logs) =>
  logs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

export const getAuditLogsStats = (logs) => ({
  total: logs.length,
  creates: logs.filter((log) => log.action === "CREATE").length,
  updates: logs.filter((log) => log.action === "UPDATE").length,
  deletes: logs.filter((log) => log.action === "DELETE").length,
});

export const getActionDescription = (log) => {
  const resourceCfg = resourceConfig[log.resource] || { label: log.resource };
  return `${actionLabels[log.action] || log.action} ${resourceCfg.label}`;
};
