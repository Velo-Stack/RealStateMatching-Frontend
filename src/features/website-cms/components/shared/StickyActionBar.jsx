import { useState, useEffect } from "react";
import { ArrowRight, FloppyDisk } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StickyActionBar = ({
  title,
  subtitle,
  onSave,
  onBack,
  isSaving = false,
  isDirty = false,
  backUrl = "/app/website",
  saveLabel = "حفظ التغييرات"
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  // Warn on page reload/close if dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleBackClick = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      executeBack();
    }
  };

  const executeBack = () => {
    if (onBack) onBack();
    else navigate(backUrl);
  };

  return (
    <>
      <div className="sticky top-0 z-30 mb-4 sm:mb-6 flex items-center justify-between gap-2 sm:gap-4 rounded-xl sm:rounded-2xl bg-slate-900/90 backdrop-blur-xl px-3 py-2.5 sm:px-6 sm:py-4 shadow-xl border border-white/10 transition-all" dir="rtl">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="رجوع"
          >
            <ArrowRight size={18} className="sm:hidden" />
            <ArrowRight size={20} className="hidden sm:block" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-xl font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 truncate hidden sm:block">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isDirty && (
            <span className="text-xs text-amber-400 hidden md:inline-block">
              لديك تغييرات غير محفوظة
            </span>
          )}
          <button
            onClick={onSave}
            disabled={isSaving || (!isDirty && !isSaving)}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg
              ${isSaving 
                ? "bg-slate-700 text-slate-300 cursor-not-allowed" 
                : isDirty 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-emerald-500/25"
                  : "bg-white/10 text-slate-300 cursor-not-allowed"
              }
            `}
          >
            <FloppyDisk size={16} weight={isDirty ? "fill" : "regular"} className={`sm:hidden ${isSaving ? "animate-pulse" : ""}`} />
            <FloppyDisk size={20} weight={isDirty ? "fill" : "regular"} className={`hidden sm:block ${isSaving ? "animate-pulse" : ""}`} />
            <span>{isSaving ? "جاري الحفظ..." : saveLabel}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">تغييرات غير محفوظة</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  لديك تعديلات لم تقم بحفظها. هل أنت متأكد أنك تريد الرجوع؟ سيتم فقدان جميع التغييرات التي قمت بها.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      executeBack();
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm border border-red-500/20"
                  >
                    تجاهل والرجوع
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onSave();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors font-medium text-sm border border-emerald-500/30"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyActionBar;
