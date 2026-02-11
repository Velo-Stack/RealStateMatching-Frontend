import { motion } from "framer-motion";

const AuditLogsChangesPanel = ({ formattedChanges }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="mt-3"
  >
    {formattedChanges.type === "diff" ? (
      <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5 space-y-2">
        {formattedChanges.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-xs">
            <span className="text-slate-500 w-20 shrink-0">{item.label}:</span>
            <div className="flex items-center gap-2">
              <span className="text-red-400 line-through">
                {String(item.oldValue || "-")}
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400">
                {String(item.newValue || "-")}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5 grid grid-cols-2 gap-2">
        {formattedChanges.map((item, index) => (
          <div key={index} className="text-xs">
            <span className="text-slate-500">{item.label}: </span>
            <span className="text-slate-300">{item.value}</span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

export default AuditLogsChangesPanel;
