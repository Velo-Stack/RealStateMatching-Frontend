import { useEffect, useRef, useState } from "react";
import { investorStatsSectionData } from "./data/statsData";

const RiyalIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 1124.14 1256.39"
    className={`w-5 h-5 ${className}`}
    fill="currentColor"
  >
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
  </svg>
);

const useCountUp = (end, startCounting) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let start = 0;
    const duration = 2000;
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

    return () => clearInterval(counter);
  }, [startCounting, end]);

  return count;
};

const normalizeStatValue = (value) => {
  if (typeof value === "number") return value;
  const numericValue = String(value ?? "0").replace(/[^\d.-]/g, "");
  return Number(numericValue) || 0;
};

const StatCard = ({ item, start }) => {
  const value = normalizeStatValue(item?.value);
  const count = useCountUp(value, start);

  return (
    <div>
      <h3 className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-[#9d7857]">
        {count.toLocaleString()}
        {item?.suffix ? (
          <span className="text-base text-[#9d7857]">{item.suffix}</span>
        ) : null}
        {item?.unit ? (
          <span className="text-base text-gray-600">{item.unit}</span>
        ) : null}
        {item?.icon === "riyal" ? <RiyalIcon /> : null}
      </h3>
      <p className="text-sm text-gray-600 mt-3">{item?.label}</p>
    </div>
  );
};

const StatsSection = ({ content = investorStatsSectionData }) => {
  const sectionRef = useRef(null);
  const [start, setStart] = useState(false);
  const { title, items = [] } = content ?? investorStatsSectionData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStart(true);
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 md:px-16 text-center overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5efe7] via-[#f9f5ef] to-[#efe5db]" />

      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-[#9d7857]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #9d7857 0, #9d7857 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-[#1f1f1f]">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {items.map((item, index) => (
            <StatCard key={`${item.label}-${index}`} item={item} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
