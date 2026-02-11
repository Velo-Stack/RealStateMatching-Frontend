import { motion } from "framer-motion";
import { FileArrowDown, FilePdf } from "phosphor-react";

const ReportsCharts = ({ downloading, handleDownload }) => (
  <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
    <div className="flex items-center gap-3 mb-6">
      <FileArrowDown size={20} className="text-slate-400" />
      <h3 className="text-sm font-medium text-white">اختر صيغة التصدير</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleDownload("pdf")}
        disabled={downloading !== null}
        className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 group disabled:opacity-60"
      >
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow">
          {downloading === "pdf" ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FilePdf size={26} className="text-white" weight="duotone" />
          )}
        </div>
        <div className="text-right flex-1">
          <h4 className="text-white font-semibold mb-0.5">تصدير PDF</h4>
          <p className="text-xs text-slate-500">ملف .pdf جاهز للطباعة والمشاركة</p>
        </div>
      </motion.button>
    </div>
  </div>
);

export default ReportsCharts;
