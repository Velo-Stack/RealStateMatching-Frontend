import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import Modal from "../../../components/Modal";
import { TYPE_LABELS, STATUS_LABELS } from "../constants/registrationsConstants";
import {
  fetchRegistrations,
  approveRegistrationApi,
  rejectRegistrationApi,
} from "../services/registrationsApi";

const RegistrationsQueue = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlags();
  const enabled = isFeatureEnabled("self_registration.enabled");
  const canApprove = hasPermission(user, "registrations.approve");
  const [filter, setFilter] = useState("PENDING");
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["registrations", filter],
    queryFn: () => fetchRegistrations(filter),
    enabled: enabled && hasPermission(user, "registrations.read"),
  });

  const approve = useMutation({
    mutationFn: (id) => approveRegistrationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setSelected(null);
    },
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }) => rejectRegistrationApi(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setSelected(null);
      setRejectReason("");
    },
  });

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId || rows.length === 0) return;

    const registration = rows.find((row) => row.id === parseInt(highlightId, 10));
    if (registration) {
      setSelected(registration);
      searchParams.delete("highlight");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, rows, setSearchParams]);

  if (!enabled) {
    return (
      <div className="p-6 text-center text-slate-400">
        التسجيل الذاتي غير مفعّل حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-white">
          <UserPlus size={24} className="text-emerald-400" />
          <h1 className="text-2xl font-bold">طلبات التسجيل</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">مراجعة واعتماد طلبات الانضمام الجديدة</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["PENDING", "APPROVED", "REJECTED", ""].map((status) => (
          <button
            key={status || "ALL"}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm border ${
              filter === status
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-slate-400"
            }`}
          >
            {status ? STATUS_LABELS[status] : "الكل"}
          </button>
        ))}
      </div>

      <div className="bg-[#111827]/60 rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-slate-400 text-sm text-center">جاري التحميل...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-slate-500 text-sm text-center">لا توجد طلبات</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full text-right p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">{row.name}</p>
                    <p className="text-slate-400 text-sm">{row.email}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {TYPE_LABELS[row.type] || row.type} · {new Date(row.createdAt).toLocaleString("ar-SA")}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-300">
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `طلب: ${selected.name}` : ""}
      >
        {selected ? (
          <div className="space-y-4 text-right text-sm">
            <p><span className="text-slate-400">النوع:</span> {TYPE_LABELS[selected.type]}</p>
            <p><span className="text-slate-400">البريد:</span> {selected.email}</p>
            <p><span className="text-slate-400">الجوال:</span> {selected.phone}</p>
            {selected.officeName ? <p><span className="text-slate-400">المكتب:</span> {selected.officeName}</p> : null}
            {selected.licenseNumber ? <p><span className="text-slate-400">الترخيص:</span> {selected.licenseNumber}</p> : null}
            {selected.notes ? <p><span className="text-slate-400">ملاحظات:</span> {selected.notes}</p> : null}
            {selected.rejectionReason ? (
              <p className="text-rose-400">سبب الرفض: {selected.rejectionReason}</p>
            ) : null}

            {selected.status === "PENDING" && canApprove ? (
              <>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="سبب الرفض (اختياري)"
                  className="w-full rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-white min-h-[80px]"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    disabled={reject.isPending}
                    onClick={() => reject.mutate({ id: selected.id, reason: rejectReason })}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-white text-sm disabled:opacity-50"
                  >
                    رفض
                  </button>
                  <button
                    type="button"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(selected.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm disabled:opacity-50"
                  >
                    اعتماد
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default RegistrationsQueue;
