export const formatChanges = (log, action) => {
  if (!log) return null;

  // Handle when log is passed as the full log object
  const oldData = log.oldValues ? (typeof log.oldValues === "string" ? JSON.parse(log.oldValues) : log.oldValues) : null;
  const newData = log.newValues ? (typeof log.newValues === "string" ? JSON.parse(log.newValues) : log.newValues) : null;

  // For backward compatibility, also check for old changes object structure
  const changes = log.changes || {};
  const oldDataFallback = changes.oldData;
  const newDataFallback = changes.newData;

  const finalOldData = oldData || oldDataFallback;
  const finalNewData = newData || newDataFallback;

  if (action === "CREATE" && finalNewData) {
    const items = [];
    const newDataObj = finalNewData;

    // Show all keys from newData
    Object.keys(newDataObj).forEach((key) => {
      const value = newDataObj[key];
      if (value !== null && value !== undefined && value !== "") {
        items.push({
          label: key,
          value: formatFieldValue(key, value),
        });
      }
    });

    return items.length > 0 ? items : null;
  }

  if (action === "UPDATE" && (finalOldData || finalNewData)) {
    const items = [];
    const oldDataObj = finalOldData || {};
    const newDataObj = finalNewData || {};

    const allKeys = new Set([
      ...Object.keys(oldDataObj),
      ...Object.keys(newDataObj),
    ]);
    const ignoreKeys = ["id", "createdAt", "updatedAt", "password"];

    allKeys.forEach((key) => {
      if (ignoreKeys.includes(key)) return;
      if (JSON.stringify(oldDataObj[key]) !== JSON.stringify(newDataObj[key])) {
        items.push({
          label: key,
          oldValue: formatFieldValue(key, oldDataObj[key]),
          newValue: formatFieldValue(key, newDataObj[key]),
        });
      }
    });

    return items.length > 0 ? { type: "diff", items } : null;
  }

  if (action === "DELETE" && finalOldData) {
    const items = [];
    const oldDataObj = finalOldData;

    Object.keys(oldDataObj).forEach((key) => {
      const value = oldDataObj[key];
      if (value !== null && value !== undefined && value !== "") {
        items.push({
          label: key,
          value: formatFieldValue(key, value),
        });
      }
    });

    return items.length > 0 ? items : null;
  }

  return null;
};

const formatFieldValue = (key, value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};
