import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp, File } from "phosphor-react";
import { actionConfig, resourceConfig } from "../constants/auditLogsConfig";
import { getActionDescription } from "../utils/auditLogsUtils";
import { formatChanges } from "../utils/formatChanges";
import AuditLogsChangesPanel from "./AuditLogsChangesPanel";

const AuditLogItem = ({ log, index, isExpanded, onToggleExpand }) => {
  const actionCfg = actionConfig[log.action] || actionConfig.UPDATE;
  const resourceCfg = resourceConfig[log.resource] || {
    label: log.resource,
    icon: File,
    color: "text-slate-400",
  };
  const ActionIcon = actionCfg.icon;
  const ResourceIcon = resourceCfg.icon;
  const formattedChanges = formatChanges(log.changes, log.action);

  return (
    <motion.div
      key={log.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center ${actionCfg.bg} border ${actionCfg.border}`}
        >
          <ActionIcon size={18} className={actionCfg.text} weight="duotone" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-white text-sm font-medium">
              {log.user?.name || "مستخدم"}
            </span>
            <span className="text-slate-400 text-sm">
              {getActionDescription(log)}
            </span>
            {log.resourceId && (
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                #{log.resourceId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${actionCfg.bg} ${actionCfg.text} border ${actionCfg.border}`}
            >
              <ActionIcon size={10} />
              {actionCfg.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-white/5 ${resourceCfg.color} border border-white/10`}
            >
              <ResourceIcon size={10} />
              {resourceCfg.label}
            </span>
            <span className="text-[11px] text-slate-500">
              {new Date(log.createdAt).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {formattedChanges && (
            <motion.button
              onClick={() => onToggleExpand(log.id, isExpanded)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mt-1"
            >
              {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
              {isExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
            </motion.button>
          )}

          <AnimatePresence>
            {isExpanded && formattedChanges && (
              <AuditLogsChangesPanel formattedChanges={formattedChanges} />
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              log.user?.role === "ADMIN"
                ? "bg-rose-500/20 text-rose-400"
                : log.user?.role === "MANAGER"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {log.user?.name?.charAt(0) || "?"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogItem;
