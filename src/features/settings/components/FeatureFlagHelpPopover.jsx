import { useState } from "react";
import { Info } from "phosphor-react";
import Modal from "../../../components/Modal";
import { getFeatureFlagCatalogEntry } from "../../../config/featureFlagCatalog";

const FeatureFlagHelpPopover = ({ flagKey, enabled }) => {
  const [open, setOpen] = useState(false);
  const catalog = getFeatureFlagCatalogEntry(flagKey);

  if (!catalog) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors shrink-0"
        aria-label="تفاصيل الميزة"
        title="تفاصيل الميزة"
      >
        <Info size={16} weight="duotone" />
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={catalog.key}
        maxWidthClass="max-w-lg"
      >
        <div className="space-y-5 text-right text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">عند التفعيل</p>
            <p className="text-slate-200">{catalog.onEnable}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">عند التعطيل</p>
            <p className="text-slate-200">{catalog.onDisable}</p>
          </div>

          {catalog.sidebarLabels.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">تبويبات Sidebar</p>
              <ul className="flex flex-wrap gap-2">
                {catalog.sidebarLabels.map((label) => (
                  <li
                    key={label}
                    className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {catalog.backendRoutes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">APIs المتأثرة</p>
              <ul className="space-y-1">
                {catalog.backendRoutes.map((route) => (
                  <li
                    key={route}
                    className="font-mono text-xs text-slate-400 dir-ltr text-left"
                    dir="ltr"
                  >
                    {route}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {catalog.dependsOn?.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
              <p className="text-xs font-medium text-amber-400 mb-1">تبعيات مقترحة</p>
              <p className="text-xs text-slate-400">
                يُفضّل تفعيل: {catalog.dependsOn.join("، ")}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-500 pt-1 border-t border-white/5">
            الحالة الحالية:{" "}
            <span className={enabled ? "text-emerald-400" : "text-slate-400"}>
              {enabled ? "مفعّل" : "معطّل"}
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default FeatureFlagHelpPopover;
