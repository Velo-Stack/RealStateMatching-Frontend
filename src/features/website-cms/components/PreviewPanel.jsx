import { useState } from "react";
import { Eye } from "phosphor-react";
import { motion } from "framer-motion";
import { cardClasses } from "../constants/websiteCmsConstants";

const PreviewPanel = () => {
  const [previewMode, setPreviewMode] = useState("desktop");

  const previewModes = {
    desktop: { width: "100%", label: "Desktop", icon: "💻" },
    tablet: { width: "768px", label: "Tablet", icon: "📱" },
    mobile: { width: "375px", label: "Mobile", icon: "📲" },
  };

  return (
    <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-120px)]">
      <div className={`${cardClasses} h-full flex flex-col`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-emerald-400" weight="duotone" />
            <h3 className="text-lg font-semibold text-white">المعاينة المباشرة</h3>
          </div>

          {/* Preview Mode Buttons */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {Object.entries(previewModes).map(([mode, config]) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`
                  rounded-md px-3 py-1.5 text-xs font-medium transition-all
                  ${
                    previewMode === mode
                      ? "text-white bg-emerald-500/20 border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }
                `}
                title={config.label}
              >
                {config.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden">
          <motion.div
            key={previewMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full flex items-center justify-center"
            style={{ 
              width: previewMode === 'desktop' ? '100%' : 'auto',
            }}
          >
            <div
              className="h-full shadow-2xl"
              style={{ 
                width: previewModes[previewMode].width,
                maxWidth: '100%'
              }}
            >
              <iframe
                src="/"
                className="w-full h-full rounded-lg bg-white"
                style={{ border: 'none' }}
                title="معاينة الموقع"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </motion.div>
        </div>

        {/* Preview Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            المعاينة المباشرة للصفحة الرئيسية ({previewModes[previewMode].label})
          </span>
          <button
            onClick={() => window.open("/", "_blank")}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            فتح في نافذة جديدة ↗
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
