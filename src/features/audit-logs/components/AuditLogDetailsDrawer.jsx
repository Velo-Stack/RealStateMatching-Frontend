import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "phosphor-react";
import { useState } from "react";
import { toast } from "sonner";
import { actionConfig, resourceConfig } from "../constants/auditLogsConfig";
import { getActionDescription } from "../utils/auditLogsUtils";

const AuditLogDetailsDrawer = ({ log, isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!log) return null;

  const actionCfg = actionConfig[log.action] || actionConfig.UPDATE;
  const resourceCfg = resourceConfig[log.resource] || {
    label: log.resource,
    color: "text-slate-400",
  };
  const ActionIcon = actionCfg.icon;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("تم النسخ");
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderJsonValues = (data, title) => {
    if (!data) return null;
    const entries = Object.entries(data);
    if (entries.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-300">{title}</h4>
        <div className="bg-[#0d1117] rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-2 text-xs pb-2 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-500 min-w-max">{key}:</span>
              <div className="flex items-center gap-2">
                <code className="text-slate-300 text-right flex-1 break-words">
                  {formatValue(value)}
                </code>
                <button
                  onClick={() => copyToClipboard(formatValue(value), key)}
                  className="shrink-0 text-slate-500 hover:text-slate-400 transition-colors"
                  title="انسخ"
                >
                  {copiedField === key ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-[#111827] border-l border-white/5 z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
              <h2 className="text-lg font-semibold text-white">تفاصيل السجل</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${actionCfg.bg} border ${actionCfg.border}`}
                  >
                    <ActionIcon size={18} className={actionCfg.text} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{log.user?.name || "مستخدم"}</p>
                    <p className="text-xs text-slate-400">
                      {getActionDescription(log)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300">المعلومات الأساسية</h4>
                <div className="space-y-2 bg-[#0d1117] rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">الإجراء:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${actionCfg.bg} ${actionCfg.text} border ${actionCfg.border}`}
                    >
                      {actionCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">المورد:</span>
                    <span className="text-slate-300">{resourceCfg.label}</span>
                  </div>
                  {log.resourceId && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">معرّف المورد:</span>
                      <span className="text-slate-300 font-mono">#{log.resourceId}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">الدور:</span>
                    <span className="text-slate-300">{log.user?.role || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300">الوقت</h4>
                <div className="bg-[#0d1117] rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">التاريخ والوقت:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-slate-300 font-mono">
                        {new Date(log.createdAt).toLocaleString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            new Date(log.createdAt).toISOString(),
                            "createdAt"
                          )
                        }
                        className="text-slate-500 hover:text-slate-400"
                      >
                        {copiedField === "createdAt" ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              {(log.ipAddress || log.userAgent) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">معلومات الشبكة</h4>
                  <div className="bg-[#0d1117] rounded-lg p-4 space-y-3">
                    {log.ipAddress && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">عنوان IP:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-slate-300 font-mono">{log.ipAddress}</code>
                          <button
                            onClick={() => copyToClipboard(log.ipAddress, "ip")}
                            className="text-slate-500 hover:text-slate-400"
                          >
                            {copiedField === "ip" ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {log.userAgent && (
                      <div className="space-y-1">
                        <span className="text-slate-500 text-xs block">متصفح المستخدم:</span>
                        <code className="text-slate-300 text-xs block bg-black/30 p-2 rounded break-words max-h-24 overflow-y-auto">
                          {log.userAgent}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Changes */}
              {(log.oldValues || log.newValues) && (
                <div className="space-y-3">
                  {log.action === "UPDATE" && log.oldValues && log.newValues && (
                    <>
                      {renderJsonValues(log.oldValues, "القيم السابقة")}
                      {renderJsonValues(log.newValues, "القيم الجديدة")}
                    </>
                  )}
                  {log.action === "CREATE" && log.newValues && (
                    renderJsonValues(log.newValues, "البيانات المنشأة")
                  )}
                  {log.action === "DELETE" && log.oldValues && (
                    renderJsonValues(log.oldValues, "البيانات المحذوفة")
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuditLogDetailsDrawer;
