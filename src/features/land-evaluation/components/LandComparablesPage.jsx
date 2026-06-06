import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash, PencilSimple } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import { UI_LABELS_AR } from "../../../constants/uiLabels.ar";
import Modal from "../../../components/Modal";
import useMeta from "../../../hooks/useMeta";
import { EMPTY_COMPARABLE, SOURCE_LABELS } from "../constants/landEvaluationConstants";
import {
  fetchComparables,
  createComparableApi,
  updateComparableApi,
  deleteComparableApi,
} from "../services/landEvaluationApi";

const LandComparablesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled =
    isFeatureEnabled("land_evaluation.enabled") &&
    hasPermission(user, "lands.comparables.manage");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_COMPARABLE);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["land-comparables"],
    queryFn: () => fetchComparables(),
    enabled,
  });

  const { cities = [] } = useMeta();

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing ? updateComparableApi({ id: editing.id, payload }) : createComparableApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-comparables"] });
      setFormOpen(false);
      setEditing(null);
      setForm(EMPTY_COMPARABLE);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComparableApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["land-comparables"] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_COMPARABLE);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      cityId: row.cityId,
      neighborhoodId: row.neighborhoodId || "",
      areaM2: row.areaM2,
      salePrice: row.salePrice,
      saleDate: row.saleDate?.slice(0, 10),
      latitude: row.latitude ?? "",
      longitude: row.longitude ?? "",
      notes: row.notes || "",
      isVerified: row.isVerified,
    });
    setFormOpen(true);
  };

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        {UI_LABELS_AR.comparablesFeatureDisabled}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-100">صفقات مقارنة — أراضي</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة بيانات صفقات المقارنة لتقدير الأسعار</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="theme-button-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={18} />
          {UI_LABELS_AR.comparableAdd}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-800/60 text-slate-400">
            <tr>
              <th className="p-3">المدينة</th>
              <th className="p-3">المساحة</th>
              <th className="p-3">سعر البيع</th>
              <th className="p-3">سعر/م²</th>
              <th className="p-3">المصدر</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">جاري التحميل...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">لا توجد بيانات</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-3">{row.city?.name || "-"}</td>
                  <td className="p-3">{row.areaM2} م²</td>
                  <td className="p-3">{Number(row.salePrice).toLocaleString()} ر.س</td>
                  <td className="p-3">{Number(row.pricePerM2).toLocaleString()} ر.س</td>
                  <td className="p-3">{SOURCE_LABELS[row.source] || row.source}</td>
                  <td className="p-3">{row.saleDate?.slice(0, 10)}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => openEdit(row)} className="p-1.5 text-slate-400 hover:text-cyan-400">
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? UI_LABELS_AR.comparableEdit : UI_LABELS_AR.comparableAdd}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <div>
            <label className="block text-xs text-slate-400 mb-1">المدينة</label>
            <select
              className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm"
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
              required
            >
              <option value="">اختر المدينة</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">المساحة (م²)</label>
              <input type="number" className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm" value={form.areaM2} onChange={(e) => setForm({ ...form, areaM2: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">سعر البيع (ر.س)</label>
              <input type="number" className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">تاريخ البيع</label>
            <input type="date" className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">ملاحظات</label>
            <textarea className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-sm" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.isVerified} onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} />
            معتمد للاستخدام في التقدير
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-white/10 text-slate-300">إلغاء</button>
            <button type="submit" disabled={saveMutation.isPending} className="theme-button-primary px-4 py-2 rounded-lg text-sm">
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LandComparablesPage;
