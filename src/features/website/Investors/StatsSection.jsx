import { useEffect, useRef, useState } from "react";
import "./StatsSection.css";

const RiyalIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 1124.14 1256.39"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
  </svg>
);

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const useCountUp = (end, startCounting, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting || !end) return undefined;

    let frame = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = Math.floor(easeOutCubic(progress) * end);
      setCount(value);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startCounting, end, duration]);

  return count;
};

const normalizeStatValue = (value) => {
  if (typeof value === "number") return value;
  const numericValue = String(value ?? "0").replace(/[^\d.-]/g, "");
  return Number(numericValue) || 0;
};

const StatCard = ({ item, start, index }) => {
  const value = normalizeStatValue(item?.value);
  const count = useCountUp(value, start, 1800 + index * 120);

  return (
    <div
      className={`investor-stat ${start ? "is-visible" : ""}`}
      style={{ "--stat-delay": `${0.18 + index * 0.08}s` }}
    >
      <span className="investor-stat__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="investor-stat__value">
        <span className="investor-stat__number">{count.toLocaleString("en-US")}</span>
        {item?.suffix ? (
          <span className="investor-stat__suffix">{item.suffix}</span>
        ) : null}
        {item?.unit ? (
          <span className="investor-stat__unit">{item.unit}</span>
        ) : null}
        {item?.icon === "riyal" ? (
          <RiyalIcon className="investor-stat__riyal" />
        ) : null}
      </div>

      <span className="investor-stat__bar" />
      <p className="investor-stat__label">{item?.label}</p>
    </div>
  );
};

const StatsSection = ({ stats = [] }) => {
  const sectionRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!stats?.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`investor-stats font-cairo ${start ? "is-visible" : ""}`}
      dir="rtl"
    >
      <span className="investor-stats__glow investor-stats__glow--a" aria-hidden="true" />
      <span className="investor-stats__glow investor-stats__glow--b" aria-hidden="true" />

      <div className="investor-stats__inner">
        <div className="investor-stats__header">
          <p className="investor-stats__eyebrow">أداء رواسخ</p>
          <h2 className="investor-stats__title">أرقام وإحصائيات</h2>
          <p className="investor-stats__subtitle">
            مؤشرات تعكس نموّنا وثقة مستثمرينا في السوق السعودي
          </p>
        </div>

        <div className="investor-stats__grid">
          {stats.map((item, index) => (
            <StatCard
              key={item.id || index}
              item={item}
              start={start}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
