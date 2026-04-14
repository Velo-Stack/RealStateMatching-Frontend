import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, CaretUp, Funnel } from "phosphor-react";
import { REPORT_TYPES } from "../constants/reportsConstants";
import ReportItem from "./ReportItem";

const ReportsFilters = ({ type, setType, selectedReport, isOpen, onToggle }) => (
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
          <Funnel size={18} className="text-emerald-400" weight="duotone" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">تحديد التقرير</h3>
          <p className="text-xs text-slate-400">
            التقرير الحالي: {selectedReport?.label || "غير محدد"}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REPORT_TYPES.map((report) => (
              <ReportItem
                key={report.value}
                report={report}
                isSelected={type === report.value}
                onSelect={() => setType(report.value)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ReportsFilters;
