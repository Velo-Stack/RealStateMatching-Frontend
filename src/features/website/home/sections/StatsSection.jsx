import { useEffect, useMemo, useRef, useState } from "react";
import { stats as fallbackStats } from "../data/statsData";
import { useWebsiteStatsQuery } from "../hooks/useWebsiteHomeQuery";

const CounterItem = ({ end, label, suffix, customText }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  const isNumeric = customText === undefined || customText === null || customText === "";

  useEffect(() => {
    if (!isNumeric || !end) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const increment = Math.max(1, end / (duration / 16));

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(counter);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, isNumeric]);

  return (
    <div ref={ref} className="group text-center">
      <div className="flex items-end justify-center gap-1">
        <h3 className="text-4xl font-bold leading-none text-[#9d7857] md:text-5xl lg:text-6xl">
          {isNumeric ? count.toLocaleString() : customText}
        </h3>
        {suffix && isNumeric ? (
          <span className="mb-1 text-xl font-bold text-[#9d7857] md:text-2xl">{suffix}</span>
        ) : null}
      </div>

      <div className="mx-auto mb-3 mt-3 h-[2px] w-8 rounded-full bg-[#9d7857] transition-all duration-500 group-hover:w-14" />

      <p className="text-sm tracking-wide text-gray-500 md:text-base">{label}</p>
    </div>
  );
};

const StatsSection = ({ content }) => {
  const { data: apiStatsData } = useWebsiteStatsQuery();

  const dynamicStats = useMemo(() => {
    const apiStats = apiStatsData?.stats;
    if (Array.isArray(apiStats) && apiStats.length > 0) {
      return apiStats.map((item) => {
        const displayMode = item.displayMode || 'AUTO';
        const rawValue = String(item.value ?? "0");
        
        // Use provided numericValue, or parse it from value if in CUSTOM mode
        const numeric = displayMode === 'AUTO' 
          ? (item.numericValue || 0)
          : (Number(rawValue.replace(/[^\d]/g, "")) || 0);

        // If it's a completely text-based custom value (e.g. "أكثر من مليون")
        // or contains text, we treat it as customText unless it's just numbers and simple symbols.
        let customText = null;
        
        // Backend now provides item.suffix directly, but fallback to parsing if missing
        let suffix = item.suffix || "";

        if (displayMode === 'CUSTOM') {
            // Check if the value has letters/arabic chars
            if (/[a-zA-Z\u0600-\u06FF]/.test(rawValue)) {
                customText = rawValue;
            } else {
                // It's mostly numbers/symbols like "+50", "40", "1.5"
                if (!suffix) {
                    suffix = rawValue.replace(/[\d\s,.]/g, "") || "";
                }
            }
        } else {
            // AUTO mode
            if (!suffix) {
                suffix = rawValue.replace(/[\d\s,.]/g, "") || "";
            }
        }

        return {
          end: numeric,
          label: item.label || "",
          suffix,
          customText,
        };
      });
    }

    const incoming = content?.content?.stats;
    const baseList = Array.isArray(incoming) && incoming.length > 0 ? incoming : fallbackStats;

    return baseList.map((item) => {
      const rawValue = String(item.value ?? item.end ?? "0");
      const numeric = Number(rawValue.replace(/[^\d]/g, "")) || item.end || 0;
      const suffix = item.suffix || rawValue.replace(/[\d\s,.]/g, "") || "";

      return {
        end: numeric,
        label: item.label || "",
        suffix,
        customText: null,
      };
    });
  }, [apiStatsData, content]);

  return (
    <section className="bg-[#f8f9fa] pb-16 pt-6 font-cairo">
      <div className="mx-6 mb-10 h-px bg-gray-200 md:mx-16" />

      <div className="grid grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-16 lg:grid-cols-4">
        {dynamicStats.map((item, index) => (
          <CounterItem
            key={`${item.label}-${index}`}
            end={item.end}
            label={item.label}
            suffix={item.suffix}
            customText={item.customText}
          />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

