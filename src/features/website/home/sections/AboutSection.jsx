import { useEffect, useMemo, useRef, useState } from "react";
import { stats as fallbackStats } from "../data/statsData";
import { useWebsiteStatsQuery } from "../hooks/useWebsiteHomeQuery";
import "./AboutSection.css";

const buildStatsList = (apiStatsData, statsContent) => {
  const apiStats = apiStatsData?.stats;
  if (Array.isArray(apiStats) && apiStats.length > 0) {
    return apiStats.map((item) => {
      const displayMode = item.displayMode || "AUTO";
      const rawValue = String(item.value ?? "0");

      const numeric =
        displayMode === "AUTO"
          ? item.numericValue || 0
          : Number(rawValue.replace(/[^\d]/g, "")) || 0;

      let customText = null;
      let suffix = item.suffix || "";

      if (displayMode === "CUSTOM") {
        if (/[a-zA-Z\u0600-\u06FF]/.test(rawValue)) {
          customText = rawValue;
        } else if (!suffix) {
          suffix = rawValue.replace(/[\d\s,.]/g, "") || "";
        }
      } else if (!suffix) {
        suffix = rawValue.replace(/[\d\s,.]/g, "") || "";
      }

      return {
        end: numeric,
        label: item.label || "",
        suffix,
        customText,
      };
    });
  }

  const incoming = statsContent?.content?.stats;
  const baseList =
    Array.isArray(incoming) && incoming.length > 0 ? incoming : fallbackStats;

  return baseList.map((item) => {
    const rawValue = String(item.value ?? item.end ?? "0");
    const numeric = Number(rawValue.replace(/[^\d]/g, "")) || item.end || 0;
    const suffix = item.suffix || rawValue.replace(/[\d\s,.]/g, "") || "";

    return { end: numeric, label: item.label || "", suffix, customText: null };
  });
};

const StatItem = ({ end, label, suffix, customText, isVisible, index }) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const isNumeric = !customText;

  useEffect(() => {
    if (!isVisible || !isNumeric || !end || started.current) return;
    started.current = true;

    let start = 0;
    const duration = 1500;
    const increment = Math.max(1, end / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, isNumeric]);

  return (
    <div
      className={`about-stat ${isVisible ? "is-visible" : ""}`}
      style={{ "--stat-delay": `${0.55 + index * 0.09}s` }}
    >
      <div className="about-stat__value">
        {isNumeric ? count.toLocaleString() : customText}
        {suffix && isNumeric ? (
          <span className="about-stat__suffix">{suffix}</span>
        ) : null}
      </div>
      <span className="about-stat__bar" />
      <p className="about-stat__label">{label}</p>
    </div>
  );
};

const AboutSection = ({ content, statsContent }) => {
  const base = import.meta.env.BASE_URL || "/";
  const { data: apiStatsData } = useWebsiteStatsQuery();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const dynamicStats = useMemo(
    () => buildStatsList(apiStatsData, statsContent),
    [apiStatsData, statsContent]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const imageUrl = content?.imageUrl || `${base}images/bg_2.jpg`;
  const secondaryImageUrl = content?.secondaryImageUrl || `${base}images/bg_1.jpg`;

  return (
    <section
      ref={sectionRef}
      className={`about-stats font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="about-stats__inner">
        <div className="about-stats__header-row">
          <div className="about-stats__text">
            <p className="about-stats__eyebrow">
              {content?.subtitle || "من نحن"}
            </p>

            <h2 className="about-stats__title">
              {content?.title || "مرحبًا بك في شركة رواسخ العقارية"}
            </h2>

            <p className="about-stats__desc">
              {content?.description ||
                "نقدم لك أفضل الحلول العقارية بخبرة طويلة ورؤية حديثة تلبي احتياجاتك وتحقق تطلعاتك."}
            </p>
          </div>

          <div className="about-stats__media">
            <div className="about-stats__media-frame">
              <div className="about-stats__media-mask about-stats__media-mask--main">
                <img
                  src={imageUrl}
                  alt={content?.title || "about"}
                  className="about-stats__media-img"
                />
              </div>

              <div className="about-stats__media-mask about-stats__media-mask--accent">
                <img
                  src={secondaryImageUrl}
                  alt={content?.subtitle || "about"}
                  className="about-stats__media-img about-stats__media-img--accent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="about-stats__strip">
          {dynamicStats.map((item, index) => (
            <StatItem
              key={`${item.label}-${index}`}
              end={item.end}
              label={item.label}
              suffix={item.suffix}
              customText={item.customText}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
