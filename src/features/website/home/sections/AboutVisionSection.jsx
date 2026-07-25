import { useEffect, useRef, useState } from "react";
import "./AboutVisionSection.css";

const fallbackVisionPoints = [
  {
    title: "الاستثمار في المشاريع السكنية والتجارية",
    text: "تطوير مجتمعات حضرية جديدة في الرياض تلبي احتياجات السكان وتدعم الاقتصاد المحلي بمعايير عالمية.",
  },
  {
    title: "دعم البنية التحتية",
    text: "المشاركة في بناء وتطوير مشاريع كبرى تلبي احتياجات السوق العقاري والاقتصادي الوطني.",
  },
  {
    title: "الاستدامة البيئية",
    text: "تعزيز استخدام التكنولوجيا النظيفة والبناء الأخضر في جميع مشاريعنا.",
  },
  {
    title: "التطوير السكني والتجاري",
    text: "إنشاء مجتمعات حضرية متكاملة تحسن جودة الحياة وتتوافق مع أفضل الممارسات العالمية.",
  },
];

const toOrdinal = (index) => String(index + 1).padStart(2, "0");

const VisionRow = ({ point, index, isVisible }) => {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    setMaxHeight(open ? `${bodyRef.current?.scrollHeight ?? 0}px` : "0px");
  }, [open]);

  return (
    <div
      className={`vision-row ${isVisible ? "is-visible" : ""} ${
        open ? "is-open" : ""
      }`}
      style={{ "--row-delay": `${0.12 + index * 0.09}s` }}
    >
      <button
        type="button"
        className="vision-row__head"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="vision-row__number">{toOrdinal(index)}</span>
        <span className="vision-row__title">{point.title}</span>
        <span className="vision-row__toggle" aria-hidden="true">
          <span className="vision-row__toggle-bar vision-row__toggle-bar--h" />
          <span className="vision-row__toggle-bar vision-row__toggle-bar--v" />
        </span>
      </button>

      <div
        className="vision-row__body"
        style={{ maxHeight }}
      >
        <p ref={bodyRef} className="vision-row__text">
          {point.text}
        </p>
      </div>
    </div>
  );
};

const AboutVisionSection = ({ content }) => {
  const points =
    Array.isArray(content?.content?.points) && content.content.points.length
      ? content.content.points
      : fallbackVisionPoints;

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`vision-section font-cairo ${isVisible ? "is-visible" : ""}`}
      dir="rtl"
    >
      <div className="vision-section__inner">
        <div className="vision-section__header">
          <p className="vision-section__eyebrow">
            {content?.subtitle || "رؤية المملكة 2030"}
          </p>
          <h2 className="vision-section__title">
            {content?.title || "دور رواسخ العقارية"}
            <br />
            <span>{(content?.description || "في بناء المستقبل").split("\n")[0]}</span>
          </h2>
        </div>

        <div className="vision-section__list">
          {points.map((point, index) => (
            <VisionRow
              key={`${point.title}-${index}`}
              point={point}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutVisionSection;
