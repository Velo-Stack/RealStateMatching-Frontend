import { AnimatePresence, motion } from "framer-motion";
import {
  CaretDown,
  CaretUp,
  CheckSquare,
  Columns,
  SquaresFour,
} from "phosphor-react";

const ReportsFieldSelector = ({
  availableFields,
  selectedFields,
  onToggleField,
  onSelectAll,
  onResetDefault,
  isOpen,
  onToggle,
}) => {
  const selectedCount = selectedFields.length;

  return (
    <motion.div
      className="overflow-hidden rounded-2xl border border-white/5 bg-[#111827]/60 backdrop-blur-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <Columns size={20} className="text-emerald-400" weight="duotone" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">اختيار حقول التقرير</h3>
            <p className="text-xs text-slate-400">
              المختار الآن {selectedCount} من {availableFields.length} حقل
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300">
          <span>{isOpen ? "إخفاء" : "إظهار"}</span>
          {isOpen ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5 p-5"
          >
            <div className="mb-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onResetDefault}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
              >
                الحقول الأساسية
              </button>
              <button
                type="button"
                onClick={onSelectAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
              >
                <SquaresFour size={14} />
                تحديد الكل
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableFields.map((field) => {
                const isSelected = selectedFields.includes(field.value);

                return (
                  <button
                    key={field.value}
                    type="button"
                    onClick={() => onToggleField(field.value)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-right transition ${
                      isSelected
                        ? "border-emerald-500/35 bg-emerald-500/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm font-medium">{field.label}</span>
                    <CheckSquare
                      size={18}
                      weight={isSelected ? "fill" : "regular"}
                      className={isSelected ? "text-emerald-400" : "text-slate-600"}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportsFieldSelector;
