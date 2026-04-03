import { useEffect, useMemo, useRef, useState } from "react";
import { stats as fallbackStats } from "../data/statsData";

const CounterItem = ({ end, label, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const increment = end / (duration / 16);

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
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="group text-center">
      <div className="flex items-end justify-center gap-1">
        <h3 className="text-5xl font-bold leading-none text-[#9d7857] md:text-6xl">
          {count.toLocaleString()}
        </h3>
        {suffix ? (
          <span className="mb-1 text-2xl font-bold text-[#9d7857]">{suffix}</span>
        ) : null}
      </div>

      <div className="mx-auto mb-3 mt-3 h-[2px] w-8 rounded-full bg-[#9d7857] transition-all duration-500 group-hover:w-14" />

      <p className="text-sm tracking-wide text-gray-500 md:text-base">{label}</p>
    </div>
  );
};

const StatsSection = ({ content }) => {
  const dynamicStats = useMemo(() => {
    const incoming = content?.content?.stats;
    if (!Array.isArray(incoming) || !incoming.length) return fallbackStats;
    return incoming.map((item) => {
      const rawValue = String(item.value ?? "0");
      const numeric = Number(rawValue.replace(/[^\d]/g, "")) || 0;
      const suffix = rawValue.replace(/[\d\s,.]/g, "") || "";
      return {
        end: numeric,
        label: item.label || "",
        suffix,
      };
    });
  }, [content]);

  return (
    <section className="bg-[#f8f9fa] pb-16 pt-2 font-cairo">
      <div className="mx-6 mb-10 h-px bg-gray-200 md:mx-16" />

      <div className="grid grid-cols-1 gap-10 px-6 md:grid-cols-4 md:px-16">
        {dynamicStats.map((item, index) => (
          <CounterItem
            key={`${item.label}-${index}`}
            end={item.end}
            label={item.label}
            suffix={item.suffix}
          />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
