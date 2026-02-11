export const formatChanges = (changes, action) => {
  if (!changes) return null;

  try {
    const data = typeof changes === "string" ? JSON.parse(changes) : changes;

    if (action === "CREATE" && data.newData) {
      const items = [];
      const newData = data.newData;

      if (newData.name) items.push({ label: "الاسم", value: newData.name });
      if (newData.email) items.push({ label: "البريد", value: newData.email });
      if (newData.type) items.push({ label: "النوع", value: newData.type });
      if (newData.city) items.push({ label: "المدينة", value: newData.city });
      if (newData.neighborhood)
        items.push({ label: "الحي", value: newData.neighborhood });
      if (newData.price)
        items.push({
          label: "السعر",
          value: `${newData.price?.toLocaleString()} ر.س`,
        });
      if (newData.area)
        items.push({ label: "المساحة", value: `${newData.area} م²` });
      if (newData.role) items.push({ label: "الدور", value: newData.role });
      if (newData.status) items.push({ label: "الحالة", value: newData.status });

      return items.length > 0 ? items : null;
    }

    if (action === "UPDATE" && (data.oldData || data.newData)) {
      const items = [];
      const oldData = data.oldData || {};
      const newData = data.newData || {};

      const allKeys = new Set([
        ...Object.keys(oldData),
        ...Object.keys(newData),
      ]);
      const ignoreKeys = ["id", "createdAt", "updatedAt", "password"];

      allKeys.forEach((key) => {
        if (ignoreKeys.includes(key)) return;
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          items.push({
            label: key,
            oldValue: oldData[key],
            newValue: newData[key],
          });
        }
      });

      return items.length > 0 ? { type: "diff", items } : null;
    }

    if (action === "DELETE" && data.oldData) {
      const items = [];
      const oldData = data.oldData;

      if (oldData.name) items.push({ label: "الاسم", value: oldData.name });
      if (oldData.email) items.push({ label: "البريد", value: oldData.email });
      if (oldData.type) items.push({ label: "النوع", value: oldData.type });

      return items.length > 0 ? items : null;
    }

    return null;
  } catch {
    return null;
  }
};
