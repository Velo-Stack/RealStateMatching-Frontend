import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, DownloadSimple, ShieldCheck, FileText, CalendarBlank } from "phosphor-react";
import { useAuth } from "../../../context/AuthContext";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";
import { hasPermission } from "../../../utils/rbac";
import Modal from "../../../components/Modal";
import { TYPE_LABELS, STATUS_LABELS } from "../constants/registrationsConstants";
import {
  fetchRegistrations,
  approveRegistrationApi,
  rejectRegistrationApi,
  downloadProtectedRegistrationFileApi,
} from "../services/registrationsApi";

const FILE_TYPE_LABELS = {
  NATIONAL_ID: "الهوية الشخصية / الوطنية",
  VAL_LICENSE: "رخصة فال العقارية",
};

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
  const [downloadingFileId, setDownloadingFileId] = useState(null);

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

  const handleDownloadFile = async (file) => {
    if (!selected || downloadingFileId) return;
    try {
      setDownloadingFileId(file.id);
      await downloadProtectedRegistrationFileApi(selected.id, file.id, file.originalName);
    } catch (err) {
      alert("تعذر تنزيل الملف المحمي: " + (err?.response?.data?.message || err?.message));
    } finally {
      setDownloadingFileId(null);
    }
  };

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
        <p className="text-slate-400 text-sm mt-1">مراجعة واعتماد طلبات الانضمام الجديدة والمستندات المحمية</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["PENDING", "APPROVED", "REJECTED", ""].map((status) => (
          <button
            key={status || "ALL"}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm border ${
              filter === status
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
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
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{row.name}</p>
                      {row.files && row.files.length > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {row.files.length} مرفق محمي
                        </span>
                      ) : null}
                    </div>
                    <p className="text-slate-400 text-sm">{row.email}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {TYPE_LABELS[row.type] || row.type} · {new Date(row.createdAt).toLocaleString("ar-SA")}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300">
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
        title={selected ? `تفاصيل طلب: ${selected.name}` : ""}
      >
        {selected ? (
          <div className="space-y-4 text-right text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div><span className="text-slate-400">النوع:</span> <strong className="text-white font-medium">{TYPE_LABELS[selected.type]}</strong></div>
              <div><span className="text-slate-400">البريد:</span> <span dir="ltr" className="text-white">{selected.email}</span></div>
              <div><span className="text-slate-400">الجوال:</span> <span dir="ltr" className="text-white">{selected.phone}</span></div>
              {selected.birthDate ? (
                <div>
                  <span className="text-slate-400">تاريخ الميلاد:</span>{" "}
                  <span className="text-emerald-400 font-medium">{new Date(selected.birthDate).toLocaleDateString("ar-SA")}</span>
                </div>
              ) : null}
              {selected.officeName ? <div><span className="text-slate-400">المكتب:</span> <span className="text-white">{selected.officeName}</span></div> : null}
              {selected.licenseNumber ? <div><span className="text-slate-400">الترخيص:</span> <span className="text-white">{selected.licenseNumber}</span></div> : null}
            </div>

            {selected.notes ? (
              <div className="p-3 bg-white/5 rounded-xl text-slate-300">
                <span className="text-slate-400 block text-xs mb-1">ملاحظات الطلب:</span>
                {selected.notes}
              </div>
            ) : null}

            {/* Terms and Pledge Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                تم التعهد بصحة البيانات والموافقة على الشروط
              </span>
            </div>

            {/* Protected Files Section */}
            <div className="pt-2">
              <h4 className="font-bold text-white text-sm mb-2.5 flex items-center gap-2">
                <FileText size={18} className="text-emerald-400" />
                الوثائق والمرفقات الرسمية (محمية)
              </h4>

              {selected.files && selected.files.length > 0 ? (
                <div className="space-y-2">
                  {selected.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-white/10"
                    >
                      <div>
                        <p className="text-white font-medium text-xs sm:text-sm">
                          {FILE_TYPE_LABELS[file.type] || file.type}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {file.originalName} · {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={downloadingFileId === file.id}
                        onClick={() => handleDownloadFile(file)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <DownloadSimple size={15} />
                        {downloadingFileId === file.id ? "جاري التحميل..." : "تحميل/معاينة"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-3 bg-white/5 rounded-xl">لا توجد مستندات مرفقة لهذا الطلب.</p>
              )}
            </div>

            {selected.rejectionReason ? (
              <p className="text-rose-400 text-xs p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                سبب الرفض: {selected.rejectionReason}
              </p>
            ) : null}

            {selected.status === "PENDING" && canApprove ? (
              <div className="pt-3 border-t border-white/10 space-y-3">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="سبب الرفض (في حال تم الرفض)"
                  className="w-full rounded-xl border border-white/10 bg-[#111827]/60 px-3 py-2 text-white min-h-[70px] text-sm focus:border-red-500/40 focus:outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    disabled={reject.isPending}
                    onClick={() => reject.mutate({ id: selected.id, reason: rejectReason })}
                    className="rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-white text-sm font-bold disabled:opacity-50 transition-colors"
                  >
                    رفض الطلب
                  </button>
                  <button
                    type="button"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(selected.id)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-white text-sm font-bold disabled:opacity-50 transition-colors"
                  >
                    اعتماد الطلب
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default RegistrationsQueue;
