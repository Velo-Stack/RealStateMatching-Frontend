import { useState } from 'react';
import api from '../../../../utils/api';
import {
  LABELS,
  FILE_TYPE_LABELS,
  STATUS_LABELS,
} from '../../constants/joinUsConstants';

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 text-white text-sm font-medium"
      >
        {title}
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="p-4 space-y-2 text-sm text-slate-300">{children}</div> : null}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-slate-500 shrink-0">{label}</span>
    <span className="text-right text-slate-200">{value || '—'}</span>
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

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <Section title="البيانات الشخصية" defaultOpen>
        <Row label="الاسم" value={application.fullName} />
        <Row label="الجنس" value={LABELS.gender[application.gender]} />
        <Row label="الفئة العمرية" value={LABELS.ageGroup[application.ageGroup]} />
        <Row label="المدينة" value={application.city?.name} />
        <Row label="الجوال" value={application.phone} />
        <Row label="الإيميل" value={application.email} />
        <Row label="المؤهل" value={LABELS.education[application.education]} />
      </Section>

      <Section title="الرخصة والمهنة">
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

      <Section title="طبيعة العمل">
        <Row label="طبيعة العمل" value={LABELS.preferredWorkStyle[application.preferredWorkStyle]} />
        <Row label="التحديات" value={application.currentChallenges} />
        <Row label="الأدوات" value={formatList(application.techTools, LABELS.techTools)} />
        <Row label="نظام العوائد" value={LABELS.rewardSystem[application.rewardSystem]} />
      </Section>

      <Section title="التمكين والتطوير">
        <Row label="برامج تدريبية" value={LABELS.wantsTraining[application.wantsTraining]} />
        <Row
          label="مجالات التطوير"
          value={formatList(application.developmentAreas, LABELS.developmentAreas)}
        />
        <Row label="بيئة العمل المثالية" value={application.dreamWorkEnvironment} />
      </Section>

      <Section title="المرفقات" defaultOpen>
        {!application.files?.length ? (
          <p className="text-slate-500">لا توجد مرفقات</p>
        ) : (
          application.files.map((file) => (
            <div
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0"
            >
              <div>
                <p className="text-white text-sm">{FILE_TYPE_LABELS[file.type] || file.type}</p>
                <p className="text-slate-500 text-xs">{file.originalName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => previewFile(file.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/15"
                >
                  عرض
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(file.id, file.originalName)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                >
                  تحميل
                </button>
              </div>
            </div>
          ))
        )}
      </Section>

      {canManage ? (
        <div className="border border-white/10 rounded-xl p-4 space-y-3">
          <p className="text-white text-sm font-medium">تحديث الحالة</p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="ملاحظات الإدارة (اختياري)"
            className="w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white min-h-[80px]"
          />
          {status === 'REJECTED' ? (
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="سبب الرفض *"
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white min-h-[80px]"
            />
          ) : null}
          <button
            type="button"
            disabled={statusUpdating}
            onClick={handleSaveStatus}
            className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 disabled:opacity-50"
          >
            {statusUpdating ? 'جاري الحفظ...' : 'حفظ الحالة'}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5"
      >
        إغلاق
      </button>
    </div>
  );
};

export default JoinApplicationDetailModal;
