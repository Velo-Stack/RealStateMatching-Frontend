import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Eye,
  FloppyDisk,
  ArrowsClockwise,
  Lock,
  CheckCircle,
  XCircle,
  Info,
} from "phosphor-react";
import Modal from "../../../components/Modal";
import {
  useActiveMatchingRule,
  useMatchingCatalog,
  useUpdateMatchingRule,
  usePreviewMatchingRule,
  useRerunMatches,
} from "../hooks/useMatchingRule";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const KIND_LABELS = { categorical: "تطابق تام", numeric: "نطاق رقمي" };
const KIND_COLORS = {
  categorical: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  numeric: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const PCT = (v) => `${Math.round(v)}%`;

// ─── Subcomponents ────────────────────────────────────────────────────────────

const CriterionRow = ({ criterion, meta, mandatory, onChange }) => {
  const isDisabled = mandatory;
  const kindColor = KIND_COLORS[meta?.kind] ?? "text-slate-400 bg-white/5 border-white/10";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition-colors ${
        criterion.enabled
          ? "border-white/10 bg-white/[0.03]"
          : "border-white/5 bg-transparent opacity-60"
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={criterion.enabled}
          disabled={isDisabled}
          onClick={() => !isDisabled && onChange({ ...criterion, enabled: !criterion.enabled })}
          title={isDisabled ? "هذا المعيار إلزامي ولا يمكن تعطيله" : undefined}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed ${
            criterion.enabled ? "bg-emerald-500" : "bg-slate-600"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              criterion.enabled ? "right-0.5" : "right-[calc(100%-1.375rem)]"
            }`}
          />
        </button>

        {/* Label */}
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          <span className="font-medium text-white text-sm">{meta?.label ?? criterion.key}</span>
          {mandatory && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
              <Lock size={10} weight="fill" />
              إلزامي
            </span>
          )}
          <span className={`inline-flex items-center text-[10px] border rounded-full px-2 py-0.5 ${kindColor}`}>
            {KIND_LABELS[meta?.kind] ?? meta?.kind}
          </span>
        </div>

        {/* Weight Badge */}
        {criterion.enabled && (
          <span className="shrink-0 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1">
            {criterion.weight}
          </span>
        )}
      </div>

      {/* Controls (only when enabled) */}
      <AnimatePresence>
        {criterion.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 pr-14">
              {/* Weight Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">الوزن النسبي</span>
                  <span className="text-xs font-mono text-white">{criterion.weight}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={criterion.weight}
                  onChange={(e) => onChange({ ...criterion, weight: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              {/* Tolerance Slider (numeric only) */}
              {meta?.kind === "numeric" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">نسبة التسامح</span>
                    <span className="text-xs font-mono text-white">
                      {PCT((criterion.tolerance ?? 0.1) * 100)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={Math.round((criterion.tolerance ?? 0.1) * 100)}
                    onChange={(e) =>
                      onChange({ ...criterion, tolerance: Number(e.target.value) / 100 })
                    }
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                    <span>0%</span>
                    <span className="text-slate-500">مثال: 10% = ±10% في النطاق</span>
                    <span>50%</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Preview Modal ────────────────────────────────────────────────────────────

const PreviewModal = ({ isOpen, onClose, previewData, onConfirm, isConfirming }) => {
  const diff = previewData ? previewData.expectedMatchCount - previewData.currentMatchCount : 0;
  const diffColor = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-slate-400";
  const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="معاينة تأثير القاعدة الجديدة" maxWidthClass="max-w-sm">
      {previewData && (
        <div className="p-5 space-y-5">
          <p className="text-sm text-slate-400">
            قبل التطبيق، راجع الأرقام المتوقعة بناءً على القاعدة الجديدة:
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-white">{previewData.currentMatchCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">التطابقات الحالية</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className={`text-2xl font-bold ${diffColor}`}>{diffLabel}</p>
              <p className="text-[11px] text-slate-400 mt-1">الفرق</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-white">{previewData.expectedMatchCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">المتوقع بعد التطبيق</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              سيتم حفظ snapshot للتطابقات الحالية تلقائياً قبل التطبيق، ويمكن الرجوع إليها لاحقاً.
            </p>
          </div>

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
              disabled={isConfirming}
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 py-2.5 text-sm font-semibold text-white transition"
            >
              {isConfirming ? "جاري التطبيق..." : "تطبيق القاعدة"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MatchingRuleEditor = () => {
  const { user } = useAuth();
  const isAdmin = hasRole(user, [ROLES.ADMIN]);

  const { data: rule, isLoading: ruleLoading } = useActiveMatchingRule(isAdmin);
  const { data: catalogData, isLoading: catalogLoading } = useMatchingCatalog(isAdmin);

  const updateMutation = useUpdateMatchingRule();
  const previewMutation = usePreviewMatchingRule();
  const rerunMutation = useRerunMatches();

  const [localCriteria, setLocalCriteria] = useState(null);
  const [localMinScore, setLocalMinScore] = useState(30);
  const [ruleName, setRuleName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // تهيئة الحالة المحلية من API عند أول تحميل
  const criteria = localCriteria ?? rule?.criteria ?? [];
  const minScore  = localCriteria ? localMinScore : (rule?.minScore ?? 30);

  const catalog   = catalogData?.catalog ?? [];
  const mandatory = new Set(catalogData?.mandatory ?? []);

  const getMeta = useCallback(
    (key) => catalog.find((c) => c.key === key),
    [catalog],
  );

  const handleCriterionChange = (updatedCriterion) => {
    setLocalCriteria((prev) => {
      const base = prev ?? rule?.criteria ?? [];
      return base.map((c) => (c.key === updatedCriterion.key ? updatedCriterion : c));
    });
    if (!localCriteria && rule?.criteria) {
      setLocalMinScore(rule.minScore ?? 30);
      setRuleName(rule.name ?? "");
    }
    setIsDirty(true);
  };

  const handleMinScoreChange = (val) => {
    if (!localCriteria && rule?.criteria) {
      setLocalCriteria(rule.criteria);
      setRuleName(rule.name ?? "");
    }
    setLocalMinScore(val);
    setIsDirty(true);
  };

  const handleReset = () => {
    setLocalCriteria(null);
    setLocalMinScore(rule?.minScore ?? 30);
    setRuleName(rule?.name ?? "");
    setIsDirty(false);
  };

  const handlePreview = () => {
    previewMutation.mutate(
      { criteria, minScore },
      { onSuccess: () => setPreviewOpen(true) },
    );
  };

  const handleApply = () => {
    updateMutation.mutate(
      { criteria, minScore, name: ruleName || undefined, label: `قبل تحديث ${new Date().toLocaleDateString("ar-EG")}` },
      {
        onSuccess: () => {
          setLocalCriteria(null);
          setIsDirty(false);
          setPreviewOpen(false);
        },
      },
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
        <Lock size={40} weight="thin" />
        <p className="text-sm">هذا القسم مخصص للمسؤولين فقط</p>
      </div>
    );
  }

  if (ruleLoading || catalogLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        جاري تحميل القاعدة...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-emerald-400" weight="duotone" />
            قاعدة التطابق الذكي
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            حدد المعايير وأوزانها النسبية — الأوزان تُطبَّع تلقائياً ولا يشترط مجموعها 100
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 transition"
            >
              تراجع
            </button>
          )}
          <button
            type="button"
            onClick={() => rerunMutation.mutate()}
            disabled={rerunMutation.isPending}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowsClockwise size={13} className={rerunMutation.isPending ? "animate-spin" : ""} />
            إعادة الحساب
          </button>
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewMutation.isPending}
            className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-300 hover:bg-violet-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Eye size={13} />
            {previewMutation.isPending ? "جاري المعاينة..." : "معاينة"}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!isDirty || updateMutation.isPending}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5"
          >
            <FloppyDisk size={13} />
            {updateMutation.isPending ? "جاري الحفظ..." : "حفظ القاعدة"}
          </button>
        </div>
      </div>

      {/* Rule Name */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1.5">اسم القاعدة (اختياري)</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => { setRuleName(e.target.value); setIsDirty(true); }}
            placeholder="مثال: قاعدة الربع الثالث 2025"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none transition"
          />
        </div>

        {/* Min Score */}
        <div className="sm:w-52">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400">الحد الأدنى للتطابق</label>
            <span className="text-xs font-mono font-bold text-white">{PCT(minScore)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(e) => handleMinScoreChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Dirty indicator */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 flex items-center gap-2"
        >
          <Info size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            يوجد تغييرات غير محفوظة — اضغط <strong>حفظ القاعدة</strong> لتطبيق التغييرات أو{" "}
            <strong>معاينة</strong> لرؤية التأثير أولاً.
          </p>
        </motion.div>
      )}

      {/* Criteria List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-300">معايير التطابق</h3>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" weight="fill" />
              {criteria.filter((c) => c.enabled).length} مفعّل
            </span>
            <span className="flex items-center gap-1">
              <XCircle size={12} className="text-slate-600" weight="fill" />
              {criteria.filter((c) => !c.enabled).length} معطّل
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {criteria.map((criterion) => (
            <CriterionRow
              key={criterion.key}
              criterion={criterion}
              meta={getMeta(criterion.key)}
              mandatory={mandatory.has(criterion.key)}
              onChange={handleCriterionChange}
            />
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        previewData={previewMutation.data}
        onConfirm={handleApply}
        isConfirming={updateMutation.isPending}
      />
    </div>
  );
};

export default MatchingRuleEditor;
