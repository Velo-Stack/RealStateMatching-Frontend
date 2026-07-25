import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowSquareOut, ArrowsOut, Circle, Eye, X } from "phosphor-react";

const PREVIEW_SOURCE = "rwasihk-cms-preview";

const DEVICES = {
  desktop: { width: "1280px", label: "كمبيوتر" },
  tablet: { width: "768px", label: "تابلت" },
  mobile: { width: "390px", label: "موبايل" },
};

/**
 * Live preview of the public "علاقات المستثمرين" page for the Investors CMS editor.
 * Same pattern as HomeLivePreview / ProjectLivePreview: renders the real page in an
 * iframe (?cmsPreview=1), streams the in-progress form drafts into it, and
 * auto-scrolls to whichever section is currently open in the editor.
 */
const InvestorLivePreview = ({ payload, anchor }) => {
  const iframeRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [isExpanded, setIsExpanded] = useState(false);

  const previewUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/investors?cmsPreview=1`;
  }, []);

  // Close the fullscreen popup with Escape, and lock page scroll while it's open.
  useEffect(() => {
    if (!isExpanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isExpanded]);

  const postToPreview = useCallback((message) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage({ source: PREVIEW_SOURCE, ...message }, window.location.origin);
    } catch {
      // ignore, iframe may not be ready yet
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const msg = event.data;
      if (!msg || msg.source !== PREVIEW_SOURCE) return;
      if (msg.type === "ready") setIsReady(true);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleIframeLoad = () => setIsReady(false);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      postToPreview({ type: "update", payload });
    }, 200);
    return () => clearTimeout(timer);
  }, [isReady, payload, postToPreview]);

  useEffect(() => {
    if (!isReady || !anchor) return;
    postToPreview({ type: "scroll", anchor });
  }, [isReady, anchor, postToPreview]);

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={
          isExpanded
            ? "fixed inset-6 z-[100] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
            : "lg:sticky lg:top-24 flex h-[calc(100vh-140px)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl"
        }
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-emerald-400" weight="duotone" />
            <span className="text-sm font-semibold text-white">معاينة مباشرة</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Circle size={8} weight="fill" className={isReady ? "animate-pulse" : "text-slate-500"} />
              {isReady ? "متصلة" : "جاري التحميل..."}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {Object.entries(DEVICES).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDevice(key)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  device === key
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {device === "desktop" && !isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="فتح المعاينة بحجم كامل"
              >
                <ArrowsOut size={14} />
              </button>
            )}
            {isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="إغلاق"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.open("/investors", "_blank")}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="فتح صفحة المستثمرين في نافذة جديدة"
              >
                <ArrowSquareOut size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="relative flex-1 overflow-auto bg-slate-950/60 p-3">
          <motion.div
            key={device}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="mx-auto h-full"
            style={{
              width: DEVICES[device].width,
              maxWidth: device === "desktop" ? "none" : "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="معاينة صفحة علاقات المستثمرين"
              onLoad={handleIframeLoad}
              className="h-full w-full rounded-xl border border-white/10 bg-white"
              style={{ minHeight: "480px" }}
            />
          </motion.div>
        </div>

        <div className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-500">
          كل تعديل تكتبه يظهر هنا فورًا — وعند فتح أي قسم من الأقسام جنب، تنتقل المعاينة له تلقائياً.
        </div>
      </div>
    </>
  );
};

export default InvestorLivePreview;
