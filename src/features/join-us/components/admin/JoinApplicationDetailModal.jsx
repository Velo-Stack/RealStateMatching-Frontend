import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  CaretDown,
  DownloadSimple,
  Eye,
  FileText,
  IdentificationCard,
  User,
} from 'phosphor-react';
import api from '../../../../utils/api';
import {
  LABELS,
  FILE_TYPE_LABELS,
  STATUS_LABELS,
} from '../../constants/joinUsConstants';
import {
  ADMIN_JOIN_GRADIENT,
  JOIN_US_COLORS,
  STATUS_STYLES,
} from './adminJoinUsTheme';

const FILE_ICONS = {
  FAL_LICENSE: IdentificationCard,
  NATIONAL_ID: IdentificationCard,
  CV: FileText,
  CERTIFICATE: FileText,
  OTHER: FileText,
};

const Section = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2.5 text-white text-sm font-semibold">
          {Icon ? (
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(201, 168, 76, 0.12)' }}
            >
              <Icon size={16} className="text-[#C9A84C]" />
            </span>
          ) : null}
          {title}
        </div>
        <Motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-500"
        >
          <CaretDown size={16} />
        </Motion.span>
      </button>
      <AnimatePresence>
        {open ? (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2.5 text-sm border-t border-white/[0.06]">
              {children}
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1.5 border-b border-white/[0.04] last:border-0">
    <span className="text-slate-500 shrink-0">{label}</span>
    <span className="text-right text-slate-200 font-medium">{value || '—'}</span>
  </div>
);

const formatList = (items, labelMap) => {
  if (!Array.isArray(items) || !items.length) return '—';
  return items.map((item) => labelMap?.[item] || item).join('، ');
};

const JoinApplicationDetailModal = ({
  application,
  canManage,
  onClose,
  onStatusChange,
  statusUpdating,
}) => {
  const [status, setStatus] = useState(application.status);
  const [adminNotes, setAdminNotes] = useState(application.adminNotes || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const statusStyle = STATUS_STYLES[application.status] || STATUS_STYLES.PENDING;

  const downloadFile = async (fileId, fileName) => {
    const { data } = await api.get(
      `/admin/join-applications/${application.id}/files/${fileId}`,
      { responseType: 'blob' },
    );
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const previewFile = async (fileId) => {
    const { data } = await api.get(
      `/admin/join-applications/${application.id}/files/${fileId}/preview`,
      { responseType: 'blob' },
    );
    const url = window.URL.createObjectURL(data);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveStatus = () => {
    onStatusChange({
      status,
      adminNotes,
      rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
    });
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0f172a]/80 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/20 transition-all';

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1" dir="rtl">
      <div
        className={`rounded-2xl border p-4 bg-gradient-to-br ${statusStyle.gradient} border-white/[0.08]`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-white font-bold text-lg">{application.fullName}</p>
            <p className="text-slate-400 text-sm mt-0.5">{application.email}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${statusStyle.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {STATUS_LABELS[application.status]}
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-2">
          تاريخ التقديم: {new Date(application.createdAt).toLocaleString('ar-SA')}
        </p>
      </div>

      <Section title="البيانات الشخصية" defaultOpen icon={User}>
        <Row label="الاسم" value={application.fullName} />
        <Row label="الجنس" value={LABELS.gender[application.gender]} />
        <Row label="الفئة العمرية" value={LABELS.ageGroup[application.ageGroup]} />
        <Row label="المدينة" value={application.city?.name} />
        <Row label="الجوال" value={application.phone} />
        <Row label="الإيميل" value={application.email} />
        <Row label="المؤهل" value={LABELS.education[application.education]} />
      </Section>

      <Section title="الرخصة والمهنة" icon={IdentificationCard}>
        <Row label="رخصة فال" value={LABELS.hasFalLicense[application.hasFalLicense]} />
        {application.falLicenseNumber ? (
          <Row label="رقم الرخصة" value={application.falLicenseNumber} />
        ) : null}
        {application.licenseExpiry ? (
          <Row
            label="انتهاء الرخصة"
            value={new Date(application.licenseExpiry).toLocaleDateString('ar-SA')}
          />
        ) : null}
        <Row label="الخبرة" value={LABELS.experienceYears[application.experienceYears]} />
        <Row
          label="التخصصات"
          value={formatList(application.specializations, LABELS.specializations)}
        />
      </Section>

      <Section title="طبيعة العمل" icon={FileText}>
        <Row label="طبيعة العمل" value={LABELS.preferredWorkStyle[application.preferredWorkStyle]} />
        <Row label="التحديات" value={application.currentChallenges} />
        <Row label="الأدوات" value={formatList(application.techTools, LABELS.techTools)} />
        <Row label="نظام العوائد" value={LABELS.rewardSystem[application.rewardSystem]} />
      </Section>

      <Section title="التمكين والتطوير" icon={User}>
        <Row label="برامج تدريبية" value={LABELS.wantsTraining[application.wantsTraining]} />
        <Row
          label="مجالات التطوير"
          value={formatList(application.developmentAreas, LABELS.developmentAreas)}
        />
        <Row label="بيئة العمل المثالية" value={application.dreamWorkEnvironment} />
      </Section>

      <Section title="المرفقات" defaultOpen icon={FileText}>
        {!application.files?.length ? (
          <p className="text-slate-500 py-2">لا توجد مرفقات</p>
        ) : (
          <div className="space-y-2">
            {application.files.map((file) => {
              const FileIcon = FILE_ICONS[file.type] || FileText;
              return (
                <div
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(45, 80, 22, 0.15)' }}
                    >
                      <FileIcon size={20} className="text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium">
                        {FILE_TYPE_LABELS[file.type] || file.type}
                      </p>
                      <p className="text-slate-500 text-xs truncate">{file.originalName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => previewFile(file.id)}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06] transition-colors"
                    >
                      <Eye size={14} />
                      عرض
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile(file.id, file.originalName)}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                      style={{ background: ADMIN_JOIN_GRADIENT }}
                    >
                      <DownloadSimple size={14} />
                      تحميل
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {canManage ? (
        <div className="rounded-2xl border border-white/[0.08] p-5 space-y-3 bg-white/[0.02]">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: JOIN_US_COLORS.gold }}
            />
            تحديث الحالة
          </p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="ملاحظات الإدارة (اختياري)"
            className={`${inputClass} min-h-[80px] resize-y`}
          />
          {status === 'REJECTED' ? (
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="سبب الرفض *"
              className={`${inputClass} min-h-[80px] resize-y`}
            />
          ) : null}
          <button
            type="button"
            disabled={statusUpdating}
            onClick={handleSaveStatus}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-95 disabled:opacity-50 shadow-lg"
            style={{ background: ADMIN_JOIN_GRADIENT }}
          >
            {statusUpdating ? 'جاري الحفظ...' : 'حفظ الحالة'}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/[0.04] transition-colors"
      >
        إغلاق
      </button>
    </div>
  );
};

export default JoinApplicationDetailModal;
