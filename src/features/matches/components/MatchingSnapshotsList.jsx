import { useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowCounterClockwise,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Handshake,
  Spinner,
  Warning,
} from "phosphor-react";
import Modal from "../../../components/Modal";
import { useMatchingSnapshots, useRestoreSnapshot } from "../hooks/useMatchingRule";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CRITERIA_LABELS = {
  usage:        "الاستخدام",
  subType:      "النوع الفرعي",
  type:         "نوع العقار",
  city:         "المدينة",
  neighborhood: "الحي",
  purpose:      "الغرض",
  landStatus:   "حالة الأرض",
  area:         "المساحة",
  price:        "السعر",
};

// ─── Restore Confirm Modal ────────────────────────────────────────────────────

const RestoreConfirmModal = ({ isOpen, onClose, snapshot, onConfirm, isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="تأكيد استعادة القاعدة" maxWidthClass="max-w-sm">
    <div className="p-5 space-y-4">
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex gap-2">
        <Warning size={16} className="text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-300">
          سيتم حفظ snapshot للقاعدة الحالية تلقائياً قبل الاستعادة، ثم إعادة حساب جميع التطابقات بالقاعدة القديمة.
        </p>
      </div>

      {snapshot && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <p className="font-medium text-white mb-1">{snapshot.label ?? `Snapshot #${snapshot.id}`}</p>
          <p className="text-xs text-slate-500">تاريخ الإنشاء: {formatDate(snapshot.createdAt)}</p>
          <p className="text-xs text-slate-500">عدد التطابقات: {snapshot.totalMatches}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 py-2.5 text-sm font-semibold text-white transition flex items-center justify-center gap-2"
        >
          {isLoading && <Spinner size={14} className="animate-spin" />}
          {isLoading ? "جاري الاستعادة..." : "استعادة القاعدة"}
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Snapshot Card ────────────────────────────────────────────────────────────

const SnapshotCard = ({ snapshot, onRestore }) => {
  const [expanded, setExpanded] = useState(false);
  const rule = snapshot.ruleSnapshot ?? {};
  const enabledCriteria = Array.isArray(rule.criteria)
    ? rule.criteria.filter((c) => c.enabled)
    : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#111827]/60 overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-start gap-3 p-4">
        {/* Icon */}
        <div className="h-10 w-10 shrink-0 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Archive size={18} className="text-violet-400" weight="duotone" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">
            {snapshot.label ?? `Snapshot #${snapshot.id}`}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CalendarBlank size={11} />
              تطبيق: {formatDate(snapshot.appliedAt)}
            </span>
            {snapshot.replacedAt && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CalendarBlank size={11} />
                انتهى: {formatDate(snapshot.replacedAt)}
              </span>
            )}
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Handshake size={11} />
              {snapshot.totalMatches} تطابق
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition flex items-center gap-1"
          >
            تفاصيل القاعدة
            {expanded ? <CaretLeft size={11} /> : <CaretRight size={11} />}
          </button>
          <button
            type="button"
            onClick={() => onRestore(snapshot)}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1.5"
          >
            <ArrowCounterClockwise size={12} />
            استعادة
          </button>
        </div>
      </div>

      {/* Expanded Rule Details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/5 px-4 py-3"
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {enabledCriteria.map((c) => (
              <span
                key={c.key}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
              >
                <span className="font-medium">{CRITERIA_LABELS[c.key] ?? c.key}</span>
                <span className="text-slate-500 font-mono">{c.weight}</span>
                {c.tolerance != null && (
                  <span className="text-cyan-500 font-mono">
                    ±{Math.round(c.tolerance * 100)}%
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            الحد الأدنى للتطابق:{" "}
            <span className="font-mono text-white">{rule.minScore ?? "—"}%</span>
            {snapshot.createdBy && (
              <span className="mr-3">
                أنشأه: <span className="text-slate-300">{snapshot.createdBy.name}</span>
              </span>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MatchingSnapshotsList = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  const [page, setPage] = useState(1);
  const [restoreTarget, setRestoreTarget] = useState(null);

  const { data, isLoading } = useMatchingSnapshots({ page, limit: 10, enabled: isAdmin });
  const restoreMutation = useRestoreSnapshot();

  const snapshots = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1, total: 0 };

  const handleRestoreConfirm = () => {
    restoreMutation.mutate(
      { id: restoreTarget.id, label: `قبل استعادة "${restoreTarget.label ?? `#${restoreTarget.id}`}"` },
      { onSuccess: () => setRestoreTarget(null) },
    );
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Archive size={20} className="text-violet-400" weight="duotone" />
          سجل قواعد التطابق
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          كل تغيير في القاعدة يُحفظ تلقائياً مع التطابقات التي كانت سارية في تلك اللحظة
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
          <Spinner size={16} className="animate-spin" />
          جاري التحميل...
        </div>
      ) : snapshots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
          <Archive size={40} weight="thin" />
          <p className="text-sm">لا يوجد سجل حتى الآن — سيتم الحفظ تلقائياً عند تعديل القاعدة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {snapshots.map((snap) => (
            <SnapshotCard key={snap.id} snapshot={snap} onRestore={setRestoreTarget} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111827]/35 px-4 py-3">
          <p className="text-xs text-slate-400">
            إجمالي السجلات: <span className="font-semibold text-slate-200">{pagination.total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-50 transition"
            >
              السابق
            </button>
            <span className="text-xs text-slate-400">
              {page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-50 transition"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Restore Confirm Modal */}
      <RestoreConfirmModal
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        snapshot={restoreTarget}
        onConfirm={handleRestoreConfirm}
        isLoading={restoreMutation.isPending}
      />
    </div>
  );
};

export default MatchingSnapshotsList;
