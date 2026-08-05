import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, DownloadSimple, ShieldCheck, FileText, Eye } from "phosphor-react";
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
  fetchProtectedRegistrationFileBlobApi,
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
  const [previewState, setPreviewState] = useState(null);

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

  const handlePreviewFile = async (file) => {
    if (!selected) return;
    try {
      setPreviewState({ file, loading: true });
      const { blobUrl, contentType } = await fetchProtectedRegistrationFileBlobApi(selected.id, file.id);
      setPreviewState({ file, blobUrl, contentType, loading: false });
    } catch (err) {
      alert("تعذر فتح معاينة المستند المحمي: " + (err?.response?.data?.message || err?.message));
      setPreviewState(null);
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
        <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <UserPlus size={24} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-bold">طلبات التسجيل</h1>
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          مراجعة واعتماد طلبات الانضمام الجديدة والمستندات المحمية
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["PENDING", "APPROVED", "REJECTED", ""].map((status) => {
          const isActive = filter === status;
          return (
            <button
              key={status || "ALL"}
              type="button"
              onClick={() => setFilter(status)}
              className="rounded-xl px-4 py-2 text-sm border font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'var(--accent-glow)' : 'var(--bg-card)',
                borderColor: isActive ? 'var(--accent)' : 'var(--border-default)',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {status ? STATUS_LABELS[status] : "الكل"}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-2xl border overflow-hidden shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        {isLoading ? (
          <div className="p-8 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            جاري التحميل...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-sm text-center" style={{ color: 'var(--text-dim)' }}>
            لا توجد طلبات
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full text-right p-4 hover:opacity-90 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{row.name}</p>
                      {row.files && row.files.length > 0 ? (
                        <span
                          className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold"
                          style={{
                            backgroundColor: 'var(--success-bg)',
                            borderColor: 'var(--success-border)',
                            color: 'var(--success)',
                          }}
                        >
                          {row.files.length} مرفق محمي
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{row.email}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                      {TYPE_LABELS[row.type] || row.type} · {new Date(row.createdAt).toLocaleString("ar-SA")}
                    </p>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full border font-semibold"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `تفاصيل طلب: ${selected.name}` : ""}
      >
        {selected ? (
          <div className="space-y-4 text-right text-sm">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>النوع:</span>{" "}
                <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>{TYPE_LABELS[selected.type]}</strong>
              </div>
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>البريد:</span>{" "}
                <span dir="ltr" className="font-bold" style={{ color: 'var(--text-primary)' }}>{selected.email}</span>
              </div>
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>الجوال:</span>{" "}
                <span dir="ltr" className="font-bold" style={{ color: 'var(--text-primary)' }}>{selected.phone}</span>
              </div>
              {selected.birthDate ? (
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>تاريخ الميلاد:</span>{" "}
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{new Date(selected.birthDate).toLocaleDateString("ar-SA")}</span>
                </div>
              ) : null}
              {selected.officeName ? (
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>المكتب:</span>{" "}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selected.officeName}</span>
                </div>
              ) : null}
              {selected.licenseNumber ? (
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>ترخيص المكتب:</span>{" "}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selected.licenseNumber}</span>
                </div>
              ) : null}
              {selected.falLicenseNumber ? (
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>رقم رخصة فال:</span>{" "}
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{selected.falLicenseNumber}</span>
                </div>
              ) : null}
              {selected.falLicenseExpiry ? (
                <div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>انتهاء رخصة فال:</span>{" "}
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{new Date(selected.falLicenseExpiry).toLocaleDateString("ar-SA")}</span>
                </div>
              ) : null}
            </div>

            {selected.notes ? (
              <div
                className="p-3 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="block text-xs mb-1 font-bold" style={{ color: 'var(--text-secondary)' }}>ملاحظات الطلب:</span>
                {selected.notes}
              </div>
            ) : null}

            {/* Terms and Pledge Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold"
                style={{
                  backgroundColor: 'var(--success-bg)',
                  borderColor: 'var(--success-border)',
                  color: 'var(--success)',
                }}
              >
                <ShieldCheck size={18} />
                تم التعهد بصحة البيانات والموافقة على الشروط
              </span>
            </div>

            {/* Protected Files Section */}
            <div className="pt-2">
              <h4 className="font-bold text-sm mb-2.5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FileText size={18} style={{ color: 'var(--accent)' }} />
                الوثائق والمرفقات الرسمية (محمية)
              </h4>

              {selected.files && selected.files.length > 0 ? (
                <div className="space-y-2.5">
                  {selected.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border shadow-sm"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {FILE_TYPE_LABELS[file.type] || file.type}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {file.originalName} · {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(file)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                          style={{
                            backgroundColor: 'var(--warning-bg)',
                            borderColor: 'var(--warning-border)',
                            color: 'var(--warning)',
                          }}
                        >
                          <Eye size={15} />
                          معاينة
                        </button>
                        <button
                          type="button"
                          disabled={downloadingFileId === file.id}
                          onClick={() => handleDownloadFile(file)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-50"
                          style={{
                            backgroundColor: 'var(--success-bg)',
                            borderColor: 'var(--success-border)',
                            color: 'var(--success)',
                          }}
                        >
                          <DownloadSimple size={15} />
                          {downloadingFileId === file.id ? "جاري..." : "تحميل"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="text-xs p-3 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-dim)',
                  }}
                >
                  لا توجد مستندات مرفقة لهذا الطلب.
                </p>
              )}
            </div>

            {selected.rejectionReason ? (
              <p
                className="text-xs p-3 rounded-xl border font-medium"
                style={{
                  backgroundColor: 'var(--danger-bg)',
                  borderColor: 'var(--danger-border)',
                  color: 'var(--danger)',
                }}
              >
                سبب الرفض: {selected.rejectionReason}
              </p>
            ) : null}

            {selected.status === "PENDING" && canApprove ? (
              <div
                className="pt-3 border-t space-y-3"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="سبب الرفض (في حال تم الرفض)"
                  className="w-full rounded-2xl border px-3.5 py-2.5 min-h-[70px] text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    disabled={reject.isPending}
                    onClick={() => reject.mutate({ id: selected.id, reason: rejectReason })}
                    className="rounded-2xl px-5 py-2.5 text-white text-sm font-bold disabled:opacity-50 transition-colors shadow-md"
                    style={{
                      backgroundColor: 'var(--danger)',
                    }}
                  >
                    رفض الطلب
                  </button>
                  <button
                    type="button"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(selected.id)}
                    className="rounded-2xl px-5 py-2.5 text-slate-950 text-sm font-bold disabled:opacity-50 transition-colors shadow-md"
                    style={{
                      backgroundColor: 'var(--accent)',
                    }}
                  >
                    اعتماد الطلب
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {/* File Preview Modal */}
      <Modal
        isOpen={!!previewState}
        onClose={() => {
          if (previewState?.blobUrl) URL.revokeObjectURL(previewState.blobUrl);
          setPreviewState(null);
        }}
        title={
          previewState?.file
            ? `معاينة: ${FILE_TYPE_LABELS[previewState.file.type] || previewState.file.originalName}`
            : "معاينة المستند"
        }
      >
        {previewState?.loading ? (
          <div className="p-12 text-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            جاري جلب الملف وتجهيز المعاينة المحمية...
          </div>
        ) : previewState?.blobUrl ? (
          <div className="space-y-4 text-center">
            {previewState.contentType.includes("image") ? (
              <div
                className="max-h-[70vh] overflow-auto rounded-2xl border p-2 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <img
                  src={previewState.blobUrl}
                  alt={previewState.file.originalName}
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-md"
                />
              </div>
            ) : previewState.contentType.includes("pdf") ? (
              <iframe
                src={previewState.blobUrl}
                title={previewState.file.originalName}
                className="w-full h-[70vh] rounded-2xl border shadow-sm"
                style={{ borderColor: 'var(--border-default)' }}
              />
            ) : (
              <div
                className="p-8 text-sm rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <FileText size={48} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="font-bold text-base">{previewState.file.originalName}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>ينصح بتحميل هذا التنسيق مباشرة لقراءته.</p>
              </div>
            )}

            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <button
                type="button"
                onClick={() => handleDownloadFile(previewState.file)}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-slate-950 text-sm font-bold shadow-md transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <DownloadSimple size={18} />
                تحميل المستند
              </button>
              <button
                type="button"
                onClick={() => {
                  if (previewState?.blobUrl) URL.revokeObjectURL(previewState.blobUrl);
                  setPreviewState(null);
                }}
                className="rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default RegistrationsQueue;
