import api from "../../../utils/api";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const MATCHING_RULE_QUERY_KEY  = ["matching-rule-active"];
export const MATCHING_CATALOG_QUERY_KEY = ["matching-rule-catalog"];
export const MATCHING_SNAPSHOTS_QUERY_KEY = ["matching-snapshots"];

// ─── Catalog ─────────────────────────────────────────────────────────────────

/** جلب قائمة المعايير المتاحة من الـ backend (catalog ثابت) */
export const fetchMatchingCatalog = async () => {
  const { data } = await api.get("/admin/matching-rules/catalog");
  return data; // { catalog: [...], mandatory: [...] }
};

// ─── Active Rule ─────────────────────────────────────────────────────────────

/** جلب القاعدة النشطة مع metadata الـ catalog مدمجة */
export const fetchActiveMatchingRule = async () => {
  const { data } = await api.get("/admin/matching-rules/active");
  return data;
};

// ─── Update Rule ─────────────────────────────────────────────────────────────

/**
 * تحديث قاعدة التطابق.
 * @param {{ criteria: Array, minScore: number, name?: string, label?: string }} payload
 */
export const updateMatchingRule = async (payload) => {
  const { data } = await api.put("/admin/matching-rules", payload);
  return data;
};

// ─── Preview ─────────────────────────────────────────────────────────────────

/**
 * معاينة تأثير قاعدة جديدة بدون تطبيق.
 * @param {{ criteria: Array, minScore: number }} payload
 */
export const previewMatchingRule = async (payload) => {
  const { data } = await api.post("/admin/matching-rules/preview", payload);
  return data;
};

// ─── Re-run ──────────────────────────────────────────────────────────────────

export const rerunMatches = async () => {
  const { data } = await api.post("/admin/matching-rules/rerun");
  return data;
};

// ─── Snapshots ───────────────────────────────────────────────────────────────

export const fetchMatchingSnapshots = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get("/admin/matching-snapshots", {
    params: { page, limit },
  });
  return data;
};

export const fetchMatchingSnapshot = async (id) => {
  const { data } = await api.get(`/admin/matching-snapshots/${id}`);
  return data;
};

export const fetchSnapshotMatches = async ({ id, page = 1, limit = 50 }) => {
  const { data } = await api.get(`/admin/matching-snapshots/${id}/matches`, {
    params: { page, limit },
  });
  return data;
};

export const restoreSnapshot = async ({ id, label }) => {
  const { data } = await api.post(`/admin/matching-snapshots/${id}/restore`, { label });
  return data;
};
