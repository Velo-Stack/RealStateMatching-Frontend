import { motion } from "framer-motion";

const ReportItem = ({ report, isSelected, onSelect }) => {
  const Icon = report.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative overflow-hidden rounded-2xl border p-5 text-right transition-all duration-300 ${
        isSelected
          ? "bg-[#111827]/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : "bg-[#111827]/40 border-white/5 hover:border-white/10"
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="selectedReport"
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
      <div className="relative flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg`}
        >
          <Icon size={22} className="text-white" weight="duotone" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>
            {report.label}
          </h3>
          <p className="text-xs text-slate-500">تصدير جميع البيانات</p>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
          />
        )}
      </div>
    </motion.button>
  );
};

export default ReportItem;
