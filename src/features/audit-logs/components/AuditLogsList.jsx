import { AnimatePresence } from "framer-motion";
import { Calendar, Scroll } from "phosphor-react";
import AuditLogItem from "./AuditLogItem";

const AuditLogsList = ({ isLoading, logs, groupedLogs, expandedLog, setExpandedLog, onShowDetails }) => {
  if (isLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">جاري تحميل السجلات...</span>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
          <Scroll size={32} className="text-slate-500" />
        </div>
        <p className="text-slate-400 text-sm">لا توجد سجلات مطابقة للفلاتر الحالية</p>
      </div>
    );
  }

  const handleToggleExpand = (logId, isExpanded) => {
    setExpandedLog(isExpanded ? null : logId);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-sm text-slate-400">{date}</span>
            <span className="text-xs text-slate-600">({dateLogs.length} عملية)</span>
          </div>

          <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            <AnimatePresence>
              {dateLogs.map((log, index) => (
                <AuditLogItem
                  key={log.id}
                  log={log}
                  index={index}
                  isExpanded={expandedLog === log.id}
                  onToggleExpand={handleToggleExpand}
                  onShowDetails={onShowDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditLogsList;
