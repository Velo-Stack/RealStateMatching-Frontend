import { motion } from "framer-motion";
import { FileArrowDown, FilePdf, FileXls } from "phosphor-react";

const ReportsCharts = ({ downloading, handleDownload, canDownload }) => (
  <div className="rounded-2xl border border-white/5 bg-[#111827]/60 p-6 backdrop-blur-xl">
    <div className="mb-6 flex items-center gap-3">
      <FileArrowDown size={20} className="text-slate-400" />
      <h3 className="text-sm font-medium text-white">اختر صيغة التصدير</h3>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <motion.button
        whileHover={{ scale: canDownload ? 1.02 : 1 }}
        whileTap={{ scale: canDownload ? 0.98 : 1 }}
        onClick={() => handleDownload("pdf")}
        disabled={downloading !== null || !canDownload}
        className="group flex items-center gap-4 rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-rose-600/5 p-5 transition-all duration-300 hover:border-rose-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/25 transition-shadow group-hover:shadow-rose-500/40">
          {downloading === "pdf" ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <FilePdf size={26} className="text-white" weight="duotone" />
          )}
        </div>
        <div className="flex-1 text-right">
          <h4 className="mb-0.5 font-semibold text-white">تصدير PDF</h4>
          <p className="text-xs text-slate-500">ملف منسق للطباعة والمشاركة</p>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: canDownload ? 1.02 : 1 }}
        whileTap={{ scale: canDownload ? 0.98 : 1 }}
        onClick={() => handleDownload("excel")}
        disabled={downloading !== null || !canDownload}
        className="group flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-5 transition-all duration-300 hover:border-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
          {downloading === "excel" ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <FileXls size={26} className="text-white" weight="duotone" />
          )}
        </div>
        <div className="flex-1 text-right">
          <h4 className="mb-0.5 font-semibold text-white">تصدير Excel</h4>
          <p className="text-xs text-slate-500">ملف مرتب للتحليل والفرز والمشاركة</p>
        </div>
      </motion.button>
    </div>
  </div>
);

export default ReportsCharts;
