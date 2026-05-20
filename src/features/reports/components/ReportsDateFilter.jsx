import { AnimatePresence, motion } from "framer-motion";
import { CalendarBlank, CaretDown, CaretUp } from "phosphor-react";

const ReportsDateFilter = ({ startDate, setStartDate, endDate, setEndDate, isOpen, onToggle }) => (
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
          <CalendarBlank size={18} className="text-emerald-400" weight="duotone" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">تحديد فترة التقرير</h3>
          <p className="text-xs text-slate-400">
            {startDate && endDate ? `من ${startDate} إلى ${endDate}` : startDate ? `من ${startDate}` : endDate ? `إلى ${endDate}` : "كل الفترات"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="startDate" className="text-sm font-medium text-slate-300">
                من تاريخ
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-white/10 [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="endDate" className="text-sm font-medium text-slate-300">
                إلى تاريخ
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-white/10 [color-scheme:dark]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ReportsDateFilter;
